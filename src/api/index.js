import axios from "axios";

const URL = 'https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary'

export const getPlacesData = async (sw, ne) => {
    try {
        //request
        const { data: { data } } = await axios.get(URL, {
            params: {
                bl_latitude: sw.lat,
                tr_latitude: ne.lat,
                bl_longitude: sw.lng,
                tr_longitude: ne.lng
            },
            headers: {
                'X-RapidAPI-Key': '2f4b8a8190msh7dd3d6d24d6a396p1f7660jsnefea756a0a49',
                'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
            },
        });

        return data;
    } catch (error) {
        console.log(error);
    }
};