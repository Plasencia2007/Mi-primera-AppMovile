import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE, Region, MapViewProps } from 'react-native-maps';

export interface MapWrapperProps extends MapViewProps {
  children?: React.ReactNode;
}

const MapWrapper = React.forwardRef<MapView, MapWrapperProps>((props, ref) => {
  return <MapView ref={ref} {...props}>{props.children}</MapView>;
});

export { Marker, PROVIDER_GOOGLE };
export default MapWrapper;
