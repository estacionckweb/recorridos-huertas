import React, { Component, useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl'
import config from './../config.json';
import pin from './../assets/pin.png'
import pinSelected from './../assets/pin-selected.png'
import pinResults from './../assets/pin-results.png'


class BaseMap extends Component {
  constructor() {
    super()
    this.markersById = {}
  }

  componentDidMount() {
    mapboxgl.accessToken = config.mapbox.token;
    this.map = new mapboxgl.Map({
      container: this.rootEl,
      style: config.mapbox.style,
      attributionControl: 'false',
      pitch: 80, // pitch in degrees
      //  bearing: -60, // bearing in degrees
      //  center: [-74.065604, 4.652280],
      center: this.props.center,
      zoom: 8
    })

    // Add geolocate control to the map.
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    // <div id='map'
    //   style={{width: '100%', height: '100%', position: 'fixed', top: '0px', bottom: '0px', left: '0px'}}
    //   ref={element => this.rootEl = element}
    // >
    // </div>
  }

  // Load points onto map
  componentWillReceiveProps(nextProps) {
    var self = this
    self.clearSelection()

    // If data has not been loaded yet, load initial data
    if (nextProps.loaded && nextProps.geoJson) {
      //  console.log('json is', nextProps)

      nextProps.geoJson.features.forEach((point) => {
        console.log('loaded point', point)

        //  create pin
        var el = document.createElement('div');
        //el.className = 'marker';
        el.classList.add('marker');

        el.addEventListener('click', function () {
          // window.alert(JSON.stringify(point))
          self.props.updateSelectedPoint(point.id)
          self.map.flyTo({ center: point.geometry.coordinates, zoom: 15 })
        });
        el.onmouseover = () => {
          //  console.log("mouse")
          // el.style.backgroundImage = 'url('+ pinSelected + ')';
          // el.style.width = '35px';
          // el.style.height = '75px';
          // self.props.updateSelectedPoint(point, false)
        }
        el.onmouseout = () => {
          //  console.log("mouse")
          // el.style.backgroundImage = 'url('+ pin + ')';
          // el.style.width = '30px';
          // el.style.height = '50px';
        }

        var marker = new mapboxgl.Marker(el)
          .setLngLat(point.geometry.coordinates)
          .addTo(this.map);

        self.markersById[point.id] = {
          point: point,
          el: el,
          marker: marker,
          isSelected: false,
          isSearchResult: false
        }
      })
    }
    if (nextProps.searchResults !== this.props.searchResults) {
      self.clearSearch()
      if (nextProps.searchResults.length > 0) {
        console.log(nextProps.searchResults, self.markersById[nextProps.searchResults[0].ref])
        var feat = self.markersById[nextProps.searchResults[0].ref].point

        var n = feat.geometry.coordinates[1]
        var s = feat.geometry.coordinates[1]
        var e = feat.geometry.coordinates[0]
        var w = feat.geometry.coordinates[0]

        nextProps.searchResults.forEach((res) => {
          var marker = self.markersById[res.ref]
          marker.isSearchResult = true
          console.log('marker', marker)
          var feat = marker.point
          // expand bounds to fit new point. note, this only works for bogota because of +- coords
          if (feat.geometry.coordinates[1] > n) n = feat.geometry.coordinates[1]
          if (feat.geometry.coordinates[1] < s) s = feat.geometry.coordinates[1]
          if (feat.geometry.coordinates[0] < w) w = feat.geometry.coordinates[0]
          if (feat.geometry.coordinates[0] > e) e = feat.geometry.coordinates[0]
        })
        console.log('coords', n, s, e, w)
        // var sw = new mapboxgl.LngLat(-73.9876, 40.7661);
        // var ne = new mapboxgl.LngLat(-73.9397, 40.8002);

        var sw = new mapboxgl.LngLat(w, s,)
        var ne = new mapboxgl.LngLat(e, n)
        var llb = new mapboxgl.LngLatBounds(sw, ne);
        console.log(llb)
        //this.map.fitBounds([[s, w],[n, e]])
        this.map.fitBounds(llb)
      }
      this.updatePointStyles()
      //  nextProps.searchResults.forEach
    }
    //    if(nextProps.selectedPoint !== null) {

    if (nextProps.selectedPoint !== null) {
      var selectedPoint = this.markersById[nextProps.selectedPoint]
      if (nextProps.animate === true) {
        self.map.flyTo({ center: selectedPoint.point.geometry.coordinates, zoom: 18 })
      }
      selectedPoint.isSelected = true
    }
    this.updatePointStyles()
  }

  updatePointStyles() {
    Object.values(this.markersById).forEach((marker) => {
      if (marker.isSelected == true) {
        marker.el.classList.add('selected');
      } else {
        marker.el.classList.remove('selected');
      }
      if (marker.isSearchResult == true) {
        marker.el.classList.add('results');
      } else {
        marker.el.classList.remove('results');
      }
    })
  }

  clearSearch() {
    Object.values(this.markersById).forEach((marker) => {
      marker.isSearchResult = false
      marker.isSelected = false
    })
  }

  // reset pins to defaultState
  clearSelection() {
    Object.values(this.markersById).forEach((marker) => {
      marker.isSelected = false
    })
  }

  render() {
    return (
      <div id='map'
        style={{ overflow: 'hidden' }}
        className={this.props.style}
        ref={element => this.rootEl = element}
      >
      </div>
    );
  }
}

export const BaseMapFC = (props) => {
  const ref = useRef(null);
  const [map_, setMap] = useState(null);
  const [markersById, setMarkersById] = useState({})

  useEffect(() => {
    mapboxgl.accessToken = config.mapbox.token;
    setMap(new mapboxgl.Map({
      container: ref.current,
      style: config.mapbox.style,
      attributionControl: 'false',
      pitch: 80, // pitch in degrees
      //  bearing: -60, // bearing in degrees
      //  center: [-74.065604, 4.652280],
      center: props.center,
      zoom: 12
    }))
  }, [])

  useEffect(() => {
    if (map_ !== null) {
      map_.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }));
    }

  }, [map_])

  useEffect(() => {
    if (props.geoJson) {
      props.geoJson.features.forEach((point) => {
        console.log(point)
        var el = document.createElement('div');
        el.classList.add('marker');
        el.classList.add('icon_' + point.icon)
        el.addEventListener('click', function () {
          props.updateSelectedPoint(point.id)
          map_.flyTo({ center: point.geometry.coordinates, zoom: 13 })
        });
        el.onmouseover = () => {
        }
        el.onmouseout = () => {
        }

        var marker = new mapboxgl.Marker(el)
          .setLngLat(point.geometry.coordinates)
          .addTo(map_);

        markersById[point.id] = {
          point: point,
          el: el,
          marker: marker,
          isSelected: false,
          isSearchResult: false
        }
      })
    }
  }, [props.geoJson])

  useEffect(() => {
    Object.values(markersById).forEach((marker) => {
      if (marker.point.id == props.selectedPoint) {
        marker.el.classList.add('selected');
        marker.el.click()
      } else {
        marker.el.classList.remove('selected');
      }
    })
  }, [props.selectedPoint])

  return (
    <div id='map'
      style={{ overflow: 'hidden' }}
      className={props.style}
      ref={ref}
    >
    </div>
  );
}

export default BaseMap;
