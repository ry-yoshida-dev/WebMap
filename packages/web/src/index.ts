// Types of the core package that the props and callbacks below use, so an application can type them from this package.
export type { Attribution, Basemap, LngLat, MapCamera, MapExtent, MapViewport, Terrain } from "@web-map/core";

export { readCamera } from "./camera/readCamera.js";
export { readViewport } from "./camera/readViewport.js";

export { collectAttributions } from "./attribution/collectAttributions.js";
export { formatAttributionHtml } from "./attribution/formatAttributionHtml.js";
export { formatAttributionText } from "./attribution/formatAttributionText.js";

export { OverlayConflictError } from "./style/OverlayConflictError.js";

export { defaultMapLabels } from "./react/map/defaultMapLabels.js";
export type { MapContextValue } from "./react/map/MapContextValue.js";
export type { MapLabels } from "./react/map/MapLabels.js";
export { MissingMapContextError } from "./react/map/MissingMapContextError.js";
export { WebMap } from "./react/map/WebMap.js";
export type { WebMapProps } from "./react/map/WebMapProps.js";

export { BasemapPicker } from "./react/controls/BasemapPicker.js";
export type { BasemapPickerProps } from "./react/controls/BasemapPickerProps.js";
export { IconButton } from "./react/controls/IconButton.js";
export type { IconButtonProps } from "./react/controls/IconButtonProps.js";
export { NavigationButtons } from "./react/controls/NavigationButtons.js";
export type { NavigationButtonsProps } from "./react/controls/NavigationButtonsProps.js";
export { PositionReadout } from "./react/controls/PositionReadout.js";
export type { PositionReadoutProps } from "./react/controls/PositionReadoutProps.js";
export { TerrainPicker } from "./react/controls/TerrainPicker.js";
export type { TerrainPickerProps } from "./react/controls/TerrainPickerProps.js";
export { TerrainToggle } from "./react/controls/TerrainToggle.js";
export type { TerrainToggleProps } from "./react/controls/TerrainToggleProps.js";
export { TileStatusIndicator } from "./react/controls/TileStatusIndicator.js";
export type { TileStatusIndicatorProps } from "./react/controls/TileStatusIndicatorProps.js";
export { UsageNotice } from "./react/controls/UsageNotice.js";
export type { UsageNoticeProps } from "./react/controls/UsageNoticeProps.js";

export { MapControlSlot } from "./react/extensions/MapControlSlot.js";
export type { MapControlSlotProps } from "./react/extensions/MapControlSlotProps.js";
export { MapExtentFrame } from "./react/extensions/MapExtentFrame.js";
export type { MapExtentFrameProps } from "./react/extensions/MapExtentFrameProps.js";

export { TileStatus } from "./react/hooks/TileStatus.js";
export { useMapContext } from "./react/hooks/useMapContext.js";
export { useMapState } from "./react/hooks/useMapState.js";
export type { MapStateTarget } from "./react/hooks/useMapState.js";

export { MapColorScheme } from "./react/styles/MapColorScheme.js";

export { Icon } from "./react/icons/Icon.js";
export { IconName } from "./react/icons/IconName.js";
export type { IconProps } from "./react/icons/IconProps.js";
