import type { ReactElement } from "react";
import { BasemapPicker, NavigationButtons, PositionReadout, TileStatusIndicator, UsageNotice, useMapContext } from "@web-map/web";

import type { FloatingToolbarProps } from "./FloatingToolbarProps.js";

/**
 * Example of a toolbar built by the app in place of WebMap's own: the exported
 * controls on two panels floating over the top of the map.
 *
 * @param props - The app's own controls, placed after the basemap menu.
 * @returns The panels.
 */
export function FloatingToolbar({ children }: FloatingToolbarProps): ReactElement {
  const { map, basemaps, basemap, changeBasemap, tileStatus, labels } = useMapContext();
  return (
    <div className="floating-toolbar">
      <div className="floating-panel">
        <BasemapPicker basemaps={basemaps} basemap={basemap} onChange={changeBasemap} labels={labels} />
        <UsageNotice usage={basemap.usage} labels={labels} />
        {children}
      </div>
      <div className="floating-panel">
        <PositionReadout map={map} labels={labels} />
        <TileStatusIndicator status={tileStatus} labels={labels} />
        <NavigationButtons map={map} labels={labels} />
      </div>
    </div>
  );
}
