import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
    paper: {
        padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100px',
    },
    mapContainer: {
        height: '100%', width: '100%', padding: 0, margin: 0, position: 'relative',
    },
    markerContainer: {
        position: 'absolute', transform: 'translate(-50%, -50%)', zIndex: 1, '&:hover': { zIndex: 2 },
    },
    pointer: {
        cursor: 'pointer',
    },
    styleSwitcher: {
        position: 'absolute',
        bottom: '20px',
        right: '10px',
        zIndex: 10,
    },
    styleButton: {
        width: '64px',
        height: '64px',
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { opacity: 0.9 },
    },
    styleThumb: {
        width: '60px',
        height: '40px',
        objectFit: 'cover',
    },
    styleLabel: {
        fontSize: '8px',
        color: '#333',
        marginTop: '2px',
    },
    stylePanel: {
        position: 'absolute',
        bottom: '74px',
        right: 0,
        padding: '8px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        minWidth: '280px',
    },
    styleOption: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        borderRadius: '4px',
        padding: '4px',
        border: '2px solid transparent',
        '&:hover': { backgroundColor: '#f0f0f0' },
    },
    styleOptionActive: {
        border: '2px solid #1976d2',
    },
    styleThumbPanel: {
        width: '70px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '2px',
    },
    styleThumbMini: {
        width: '60px',
        height: '40px',
        borderRadius: '2px',
        background: 'linear-gradient(135deg, #e8e8e8 0%, #c8d6e5 50%, #a0b4c8 100%)',
    },
    thumb_streets: { background: 'linear-gradient(135deg, #f0f0f0 0%, #d4dadc 50%, #b8c4cc 100%)' },
    thumb_satellite: { background: 'linear-gradient(135deg, #1a3a1a 0%, #2d5a27 50%, #1a4a10 100%)' },
    thumb_satellite_streets: { background: 'linear-gradient(135deg, #1a3a1a 0%, #3a6a30 50%, #2a5a20 100%)' },
    thumb_outdoors: { background: 'linear-gradient(135deg, #a8d5a2 0%, #6aad5c 50%, #4a8d3c 100%)' },
    thumb_light: { background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #cccccc 100%)' },
    thumb_dark: { background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 50%, #111111 100%)' },
}));
