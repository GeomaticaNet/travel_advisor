import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { makeStyles } from "@material-ui/core/styles";

import useStyles from "./styles";
import Logo from "../Header/logo_white_large.png";

const useStylesAutocomplete = makeStyles((theme) => ({
  searchContainer: {
    position: "relative",
  },
  suggestionsList: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    zIndex: 1000,
    maxHeight: 300,
    overflow: "auto",
    backgroundColor: "white",
  },
  suggestionItem: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f0f0f0",
    },
  },
}));

const Header = ({ setCoordinates }) => {
  const classes = useStyles();
  const autocompleteClasses = useStylesAutocomplete();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const token = process.env.REACT_APP_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${token}&country=ar&language=es&limit=5`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion) => {
    const [lng, lat] = suggestion.center;
    setCoordinates({ lat, lng });
    setQuery(suggestion.place_name);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && suggestions.length > 0) {
      handleSuggestionClick(suggestions[0]);
    }
  };

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <Box
          display="flex"
          component="img"
          sx={{
            height: 32,
          }}
          alt="Geomaticanet.com"
          src={Logo}
        ></Box>
        <Typography variant="h5" className={classes.title}>
          Explorador Turístico
        </Typography>
        <Box display="flex">
          <Typography variant="h6" className={classes.title}>
            Explora nuevos lugares!
          </Typography>
          <div className={classes.search} ref={searchRef}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{ root: classes.inputRoot, input: classes.inputInput }}
              value={query}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <Paper className={autocompleteClasses.suggestionsList}>
                <List>
                  {suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      className={autocompleteClasses.suggestionItem}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <ListItemText primary={suggestion.place_name} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
