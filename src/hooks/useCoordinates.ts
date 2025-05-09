import { useEffect, useState } from "react";
import { getCoordinates } from "utils/common";

function useCoordinates() {
    const [isLoading, setIsLoading] = useState(false);
    const [coordinate, setCoordinate] = useState({
        latitude: 0,
        longitude: 0,
    });
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true);
                const d = await getCoordinates();
                setIsLoading(false);
                if (d) {
                    setCoordinate(d)
                }
            } catch (error) {
                setIsLoading(false);
            }
        }
        fetchData();
    }, [])
    return { coordinate, isLoading };
}

export default useCoordinates;