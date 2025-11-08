"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Temple {
  _id: string;
  name: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  image?: {
    imageUrl: string;
    imageHint?: string;
  };
  poojas?: Array<{
    name: string;
    price: number;
  }>;
}

interface GoogleMapProps {
  temples: Temple[];
  userLocation?: { lat: number; lng: number };
  onLocationRequest?: () => void;
  isLoadingLocation?: boolean;
}

const MapComponent: React.FC<GoogleMapProps> = ({
  temples,
  userLocation,
  onLocationRequest,
  isLoadingLocation = false
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const isInfoWindowFromClick = useRef(false);

  useEffect(() => {
    if (!mapRef.current || !window.google) return;

    // Initialize map
    const mapOptions: google.maps.MapOptions = {
      center: userLocation || { lat: 20.5937, lng: 78.9629 }, // Default to India center
      zoom: userLocation ? 12 : 5,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
      gestureHandling: 'cooperative',
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    };

    googleMapRef.current = new google.maps.Map(mapRef.current, mapOptions);

    // Create info window
    infoWindowRef.current = new google.maps.InfoWindow();

    // Add close listener to reset click flag
    infoWindowRef.current.addListener('closeclick', () => {
      isInfoWindowFromClick.current = false;
    });

    return () => {
      // Cleanup markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
    };
  }, []);

  // Update user location marker
  useEffect(() => {
    if (!googleMapRef.current || !userLocation) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setMap(null);
    }

    // Create new user marker
    userMarkerRef.current = new google.maps.Marker({
      position: userLocation,
      map: googleMapRef.current,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
      title: 'Your Location'
    });

    // Center map on user location with zoom level for ~10km radius
    googleMapRef.current.setCenter(userLocation);
    googleMapRef.current.setZoom(11); // Zoom level 11 shows approximately 10km radius
  }, [userLocation]);

  // Update temple markers
  useEffect(() => {
    if (!googleMapRef.current || !Array.isArray(temples)) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Create new markers for temples
    temples.forEach((temple) => {
      if (!temple.lat || !temple.lng) return;

      const marker = new google.maps.Marker({
        position: { lat: temple.lat, lng: temple.lng },
        map: googleMapRef.current!,
        title: temple.name,
        label: {
          text: temple.name,
          fontWeight: 'bold',
          color: '#000000',
          fontSize: '12px'
        },
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
              <circle cx="20" cy="20" r="18" fill="#DC2626" stroke="#ffffff" stroke-width="3"/>
              <path d="M20 8c-4.4 0-8 3.6-8 8 0 2.2 1 4.2 2.5 5.5L20 32l5.5-10.5c1.5-1.3 2.5-3.3 2.5-5.5 0-4.4-3.6-8-8-8z" fill="#ffffff"/>
              <circle cx="20" cy="16" r="3" fill="#DC2626"/>
            </svg>
          `),
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 40),
          labelOrigin: new google.maps.Point(20, -10)
        }
      });

      // Add click listener to open info window persistently
      marker.addListener('click', () => {
        if (infoWindowRef.current) {
          isInfoWindowFromClick.current = true;
          const content = `
            <div class="p-3 max-w-sm info-window-content" data-marker-id="${temple._id}">
              <h3 class="font-bold text-lg mb-1">${temple.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${temple.location}</p>
              ${temple.image ? `<img src="${temple.image.imageUrl}" alt="${temple.name}" class="w-full h-32 object-cover rounded mb-2" />` : ''}
              <div class="flex gap-2">
                <a href="/temples/${temple._id}" class="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">View Details</a>
                <a href="/poojas?search=${encodeURIComponent(temple.name)}" class="inline-block bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Book Pooja</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}" target="_blank" class="inline-block bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">Directions</a>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(googleMapRef.current!, marker);

          // Add listeners to the info window content after it's opened
          setTimeout(() => {
            const infoWindowContent = document.querySelector(`[data-marker-id="${temple._id}"]`);
            if (infoWindowContent) {
              infoWindowContent.addEventListener('mouseenter', () => {
                // Prevent closing when hovering over info window
                if (infoWindowRef.current) {
                  clearTimeout((infoWindowRef.current as any)._closeTimeout);
                }
              });
              infoWindowContent.addEventListener('mouseleave', () => {
                // Close after leaving info window if it was opened by hover
                if (infoWindowRef.current && !isInfoWindowFromClick.current) {
                  (infoWindowRef.current as any)._closeTimeout = setTimeout(() => {
                    if (infoWindowRef.current) {
                      infoWindowRef.current.close();
                    }
                  }, 100);
                }
              });
            }
          }, 100);
        }
      });

      // Optional: Add mouseover for preview (closes on mouseout)
      marker.addListener('mouseover', () => {
        if (infoWindowRef.current && !isInfoWindowFromClick.current) {
          const content = `
            <div class="p-3 max-w-sm">
              <h3 class="font-bold text-lg mb-1">${temple.name}</h3>
              <p class="text-sm text-gray-600 mb-2">${temple.location}</p>
              ${temple.image ? `<img src="${temple.image.imageUrl}" alt="${temple.name}" class="w-full h-32 object-cover rounded mb-2" />` : ''}
              <div class="flex gap-2">
                <a href="/temples/${temple._id}" class="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">View Details</a>
                <a href="/poojas?search=${encodeURIComponent(temple.name)}" class="inline-block bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600">Book Pooja</a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${temple.lat},${temple.lng}" target="_blank" class="inline-block bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">Directions</a>
              </div>
            </div>
          `;
          infoWindowRef.current.setContent(content);
          infoWindowRef.current.open(googleMapRef.current!, marker);
        }
      });

      // Close info window on mouseout only if it was opened by hover
      marker.addListener('mouseout', () => {
        if (infoWindowRef.current && !isInfoWindowFromClick.current) {
          // Add a delay to allow moving cursor to info window
          (infoWindowRef.current as any)._closeTimeout = setTimeout(() => {
            if (infoWindowRef.current && !isInfoWindowFromClick.current) {
              infoWindowRef.current.close();
            }
          }, 300);
        }
      });

      markersRef.current.push(marker);
    });

    // Always center on user location regardless of temples
    if (userLocation) {
      googleMapRef.current.setCenter(userLocation);
      googleMapRef.current.setZoom(11); // Zoom level 11 shows approximately 10km radius
    }
  }, [temples, userLocation]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Location Request Button */}
      {!userLocation && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            onClick={onLocationRequest}
            disabled={isLoadingLocation}
            className="bg-white text-black hover:bg-gray-100 border shadow-lg"
          >
            {isLoadingLocation ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="w-4 h-4 mr-2" />
            )}
            {isLoadingLocation ? 'Getting Location...' : 'Find Temples Near Me'}
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-1">
              <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span>Temple</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LoadingComponent = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
      <p className="text-gray-600">Loading map...</p>
    </div>
  </div>
);

const ErrorComponent = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
    <div className="text-center">
      <MapPin className="w-8 h-8 mx-auto mb-2 text-red-500" />
      <p className="text-gray-600">Failed to load map</p>
      <p className="text-sm text-gray-500 mt-1">Please check your internet connection</p>
    </div>
  </div>
);

interface TempleMapProps {
  temples: Temple[];
  height?: string;
}

export const TempleMap: React.FC<TempleMapProps> = ({ temples, height = "400px" }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | undefined>();
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Auto-request location on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      requestLocation();
    }
  }, []);

  const requestLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location permissions.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const render = (status: Status) => {
    switch (status) {
      case Status.LOADING:
        return <LoadingComponent />;
      case Status.FAILURE:
        return <ErrorComponent />;
      case Status.SUCCESS:
        return (
          <MapComponent
            temples={temples}
            userLocation={userLocation}
            onLocationRequest={requestLocation}
            isLoadingLocation={isLoadingLocation}
          />
        );
    }
  };

  return (
    <div className="w-full" style={{ height }}>
      <Wrapper
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
        render={render}
        libraries={['places']}
      />
      {locationError && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{locationError}</p>
        </div>
      )}
    </div>
  );
};

export default TempleMap;
