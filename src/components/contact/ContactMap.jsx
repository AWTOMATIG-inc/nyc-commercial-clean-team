"use client";

import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef } from "react";

const LOCATION = [-73.80472, 40.69253];

export default function ContactMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
      center: LOCATION,
      zoom: 17,
    });

    map.on("load", () => {
      new maplibregl.Marker({ color: "#ff0000" }) // bright red marker
        .setLngLat(LOCATION)
        .setPopup(
          new maplibregl.Popup().setHTML(`
            <b>NYC Commercial Clean Team</b><br/>
            146-61 107th Ave<br/>
            Jamaica, NY 11435
          `)
        )
        .addTo(map);
    });

    map.addControl(new maplibregl.NavigationControl());

    return () => map.remove();
  }, []);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "500px",
        borderRadius: "12px",
      }}
    />
  );
}