import React from "react";
import GoogleMapReact from "google-map-react";
import { Paper, Typography, useMediaQuery } from "@material-ui/core";
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import Rating from "@material-ui/lab/Rating";

import mapStyles from '../../mapStyles';
import useStyles from './styles.js';

const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClicked }) => {

    const classes = useStyles();
    const isDesktop = useMediaQuery('(min-width:600px)');



    return (
        <div className={classes.mapContainer}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: GOOGLE_API_KEYY }}
                defaultCenter={coordinates}
                center={coordinates}
                defaultZoom={14}
                margin={[50, 50, 50, 50]}
                options={''}
                onChange={(e) => {

                    setCoordinates({ lat: e.center.lat, lng: e.center.lng });
                    setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
                }}
                onChildClick={(child)=> setChildClicked(child) }
            >
                {places?.map((place, i) => (
                    <div
                        className={classes.markerContainer}
                        lat={Number(place.latitude)}
                        lng={Number(place.longitude)}
                        key={i}
                    >
                        {
                            !isDesktop ? (
                                <LocationOnOutlinedIcon color="primary" fontSize="large"/>
                            ) : (
                                <Paper elevation={3} className={classes.paper}>
                                    <Typography className={classes.typography} variant="subtitle2" gutterBottom>
                                        {place.name}
                                    </Typography>
                                    <img 
                                        className={classes.pointer}
                                        src={ place.photo ? place.photo.images.large.url : 'https://divisare-res.cloudinary.com/images/dpr_3.0,f_auto,q_auto,w_200/v1655456381/ucqwhhp02jh7rhghbobg/sampling-madara-gritane-brewery-manufaktura.jpg' }
                                        alt={place.name}
                                    />
                                    <Rating size="small" value={Number(place.rating)} readOnly />

                                </Paper>
                            )
                        }
                    </div>
                ))}
            </GoogleMapReact>
        </div>
    );

}

export default Map;
