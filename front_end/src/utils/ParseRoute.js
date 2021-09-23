import polyline from "@mapbox/polyline";

export const parseBusRoute = (busRoute) => {
  const parsedData = {};
  parsedData.totalDistance = 0;
  parsedData.totalDuration = busRoute.total_duration;

  const directions = [];
  const coordinates = [];
  for (var i = 0; i < busRoute.segments.length; i++) {
    if (busRoute.segments[i].transport_type === "bus") {
      directions.push(...parseBusSegment(busRoute.segments[i]));

      coordinates.push(...polyline.decode(busRoute.segments[i].polyline).map((coord) => [coord[1], coord[0]]));
    } else {
      parsedData.totalDistance += Number(busRoute.segments[i].distance);
      directions.push(...parseWalkSegment(busRoute.segments[i]));

      coordinates.push(...polyline.decode(busRoute.segments[i].polyline).map((coord) => [coord[1], coord[0]]));
    }
  }
  parsedData.directions = directions;
  parsedData.coordinates = coordinates;
  return parsedData;
};

export const parseWalkRoute = (walkRoute) => {
  const parsedData = {};
  parsedData.totalDistance = walkRoute.total_distance;
  parsedData.totalDuration = walkRoute.total_duration;

  // decode polyline
  parsedData.coordinates = polyline.decode(walkRoute.polyline).map((coord) => [coord[1], coord[0]]);
  parsedData.directions = parseWalkSegment(walkRoute);
  return parsedData;
};

const parseWalkSegment = (walkSegment) => {
  const directions = [];

  for (var i = 0; i < walkSegment.path.length; i++) {
    const node = walkSegment.path[i];
    directions.push({ location: `Walk to ${node.name}`, type: "walk", duration: node.duration ? node.duration : node.total_duration });
  }

  return directions;
};

const parseBusSegment = (busSegment) => {
  var locationString = "Take";

  for (var i = 0; i < busSegment.services.length; i++) {
    if (i === 0) {
      locationString += " bus ";
    }

    locationString += `${busSegment.services[i].code} (in ${Math.floor(busSegment.services[i].wait_time / 60)} min)`;

    if (busSegment.services.length > 1 && i < busSegment.services.length - 1) {
      locationString += " or ";
    }
  }

  locationString += ` to ${busSegment.path.at(-1).name}`;
  return [{ location: locationString, type: "bus", duration: busSegment.duration, stops: busSegment.path.length }];
};
