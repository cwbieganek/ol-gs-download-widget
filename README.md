# OpenLayers with WFS Layer Download Widget

This OpenLayers application implements a GeoServer WFS layer download control. It takes advantage of the outputFormat parameter supported by Web Feature Services. The user can select the WFS layer they would like to download, and one of the following formats:

- Shapefile
- CSV
- KMZ
- GeoJSON

This has traditionally been challenging to implement using the ESRI ArcGIS API for JavaScript. The reason for that is the developer would have to build the geospatial file on the client side. The developer would also have to handle transforming the data to WGS84 for the KMZ and GeoJSON formats if the data is not already in that coordinate system.

This application shows how easy this can be using OpenLayers and GeoServer Web Feature Services.

## Technology

- OpenLayers
- GeoServer
- Material Web Components

## Links

Material web components: https://github.com/material-components/material-web
