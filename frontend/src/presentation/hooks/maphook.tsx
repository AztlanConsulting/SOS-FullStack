import { useState, useEffect } from 'react';

export function UseMap(mapUseCase: any, mapService: any, divID: string) {
  const [coords, setCoords] = useState([19.4326, -99.1332]);

  useEffect(() => {
    const mapClick = (newLat: number, newLong: number) => {
      setCoords([newLat, newLong]);
      console.log("Pet's location has been updated to: ", newLat, newLong);
    };

    mapUseCase.initializeMapUseCase(mapService, divID, mapClick);
  }, [mapUseCase, mapService, divID]);

  return { coords };
}
