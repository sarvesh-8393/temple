declare namespace google.maps {
  interface LatLngLiteral {
    lat: number;
    lng: number;
  }

  interface MapOptions {
    center?: LatLngLiteral | LatLng;
    zoom?: number;
    mapTypeControl?: boolean;
    streetViewControl?: boolean;
    fullscreenControl?: boolean;
    zoomControl?: boolean;
    gestureHandling?: string;
    styles?: Array<any>;
  }

  interface MarkerOptions {
    position?: LatLngLiteral | LatLng;
    map?: Map;
    title?: string;
    icon?: string | { path?: number; scale?: number; fillColor?: string; fillOpacity?: number; strokeColor?: string; strokeWeight?: number; } | Icon;
    label?: string | MarkerLabel;
  }

  interface MarkerLabel {
    text: string;
    fontWeight?: string;
    color?: string;
    fontSize?: string;
  }

  interface Icon {
    url?: string;
    scaledSize?: Size;
    anchor?: Point;
    labelOrigin?: Point;
  }

  interface Symbol {
    path?: number;
    scale?: number;
    fillColor?: string;
    fillOpacity?: number;
    strokeColor?: string;
    strokeWeight?: number;
  }

  interface Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }

  interface Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  interface SymbolPath {
    CIRCLE: number;
  }

  interface LatLngBounds {
    constructor(sw?: LatLngLiteral, ne?: LatLngLiteral);
  }

  interface InfoWindowOptions {
    content?: string | HTMLElement;
    position?: LatLngLiteral | LatLng;
    map?: Map;
  }

  class Map {
    constructor(container: HTMLElement | null, options?: MapOptions);
    setCenter(latLng: LatLngLiteral | LatLng): void;
    setZoom(zoom: number): void;
    fitBounds(bounds: LatLngBounds, padding?: number): void;
  }

  class Marker {
    constructor(options?: MarkerOptions);
    setMap(map: Map | null): void;
    addListener(eventName: string, callback: Function): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
  }

  class InfoWindow {
    constructor(options?: InfoWindowOptions);
    setContent(content: string | HTMLElement): void;
    open(map?: Map | null, anchor?: Marker): void;
    close(): void;
    addListener(eventName: string, callback: Function): void;
  }

  const SymbolPath: SymbolPath;
}

declare namespace google.maps {
  class Size {
    constructor(width: number, height: number);
    width: number;
    height: number;
  }

  class Point {
    constructor(x: number, y: number);
    x: number;
    y: number;
  }

  class LatLngBounds {
    constructor(sw?: google.maps.LatLngLiteral, ne?: google.maps.LatLngLiteral);
  }
}

declare global {
  namespace google {
    namespace maps {
      interface SymbolPath {
        CIRCLE: number;
      }
    }
  }
}
