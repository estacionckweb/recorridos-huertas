// load all data, methods to get nearest
import config from './../config.json';
import lunr from 'lunr'
require("lunr-languages/lunr.stemmer.support")(lunr)
require("lunr-languages/lunr.es")(lunr)

const baseUrl = config.airtable.url;
// const baseUrl ='https://api.airtable.com/v0/appe2QPJNGquOBgw0/'
const fetchUrls = ['Textos', 'Puntos', 'Autores', 'Libros']

// @todo how to make the fields more flexible/customizable?
class MapData  {

  constructor (props) {
    this.Puntos = {
      all: [],
      byId: {}
    }
    this.Libros = {
      all: [],
      byId: {}
    }
    this.Autores = {
      all: [],
      byId: {}
    }
    this.Textos = {
      all: [],
      byId: {}
    }
    this.features = []
    this.lunr = null
  }


  getTextosGeoJson() {
    let features = []



    this.Textos.all.forEach((id) => {
      var texto = this.Textos.byId[id]
    //  console.log('texto', texto)
      if(texto.fields.Puntos) {
        texto.fields.Puntos.forEach((puntoId) => {
          var punto = this.Puntos.byId[puntoId]
          if (punto.fields.Longitude && punto.fields.Latitude) {
          //  punto.fields.Longitude
          var libro, autor
           if(texto.fields.Libro){
             libro = this.Libros.byId[texto.fields.Libro[0]]
             autor = this.Autores.byId[libro.fields.Autor[0]]

           } else {
             libro = {
               fields: {
                 Nombre: ''
               }
             }
             autor = {
               fields: {
                 Nombre: ''
               }
             }
           }

           texto.fields.libro = libro.fields.Nombre
           texto.fields.autor = autor.fields.Nombre
      
            // add all parameters to be indexed (meaning they will be searchable) to "fields" object

            texto.fields.punto = punto.fields.Nombre

            var textoObj = Object.assign({}, {
              libro: libro.fields.Nombre,
              autor: autor.fields.Nombre,
              punto: punto.fields.Nombre,
              texto: texto.fields.Textos,
              textoCorto: texto.fields.Textos_corto,
              createdTime: texto.createdTime,
              paginaInicio: texto.fields['Pagina inicio'],
              uniqueId: texto.id + punto.id
            })


            features.push({
              type: 'Feature',
              uniqueId: texto.id + punto.id,
              properties: textoObj,
              index: features.length,
              geometry: {
                type: 'Point',
                coordinates: [ punto.fields.Longitude += Math.random() * 0.0008 - 0.0004, punto.fields.Latitude += Math.random() * 0.0008 - 0.0004]
              }
            })


          }
        })
      }
    })
    this.features = features

    this.lunr = lunr( function() {
      this.use(lunr.es)
      this.ref('uniqueId')
      this.field('autor')
      this.field('libro')
      this.field('texto')
      this.field('punto')

      features.forEach((feature) => {
        this.add(feature.properties)
      })
    })

  //  console.log("SEARCH", this.lunr, this.lunr.search('javier'))
    return {
      type: 'FeatureCollection',
      features: features
    }
  }

  // getGeoJson() {
  //   let features = this.Puntos.all.map((id) => this.Puntos.byId[id])
  //   .filter((punto) => punto.fields.Longitude && punto.fields.Latitude)
  //   .map((punto)=> this.getGeoJsonFromPunto(punto))
  //   return {
  //     type: 'FeatureCollection',
  //     features: features
  //   }
  // }

  // getGeoJsonFromPunto(punto) {
  //   if(punto.fields.Longitude && punto.fields.Latitude) {
  //     //console.log("processing punto", punto)
  //     var autores = []
  //     var libros = []
  //     var textos = []
  //     if(punto.fields.Textos) {
  //       var libroIds = []
  //       textos = punto.fields.Textos.map((id) => {
  //         var texto = this.Textos.byId[id]
  //         if(libroIds.indexOf(texto.fields.Libro[0]) < 0) libroIds.push(texto.fields.Libro[0])
  //         return texto
  //       })
  //
  //       var autorIds = []
  //       libros = libroIds.map((id) => {
  //         var libro = this.Libros.byId[id]
  //         if(autorIds.indexOf(libro.fields.Autor[0]) < 0) autorIds.push(libro.fields.Autor[0])
  //         return libro
  //       })
  //       autores = autorIds.map((id) => this.Autores.byId[id])
  //       console.log('libro ids', libros)
  //     }
  //     punto.fields.autores = autores
  //     punto.fields.libros = libros
  //     punto.fields.textos = textos
  //
  //     return {
  //       type: 'Feature',
  //       id: punto.id,
  //       properties: punto.fields,
  //       geometry: {
  //         type: 'Point',
  //         coordinates: [ punto.fields.Longitude, punto.fields.Latitude ]
  //       }
  //     }
  //   } else {
  //     console.log('NO COORDS', punto)
  //     return undefined
  //   }
  // }

  searchData(query) {
    console.log('query', query)
    return this.lunr.search(query)
  }



  loadData() {
    let header = 'Bearer ' + config.airtable.key
    let promises = fetchUrls.map((val) => {
      return fetch(baseUrl + val, {
        method: 'GET',
        headers: {
          'Authorization': header
        }
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log("data is", responseJson, val)
        responseJson.records.forEach((record) => {
          this[val].byId[record.id] = record
        })
        this[val].all = responseJson.records.map(record => record.id)
      })
      .catch((error) => { console.error(error) })
    })

    return Promise.all(promises).catch((error) =>  { console.error(error) })
  }

  getCoordinatesFromTextoArray (textos) {
    let puntos = []
    textos.forEach((texto) => {
    //   console.log("fields", texto.item.fields.Puntos)
       if(texto.item.fields.Puntos && texto.item.fields.Puntos.length > 0) puntos.push(texto.item.fields.Puntos[0])
    })
    //  console.log(puntos)
      if (puntos.length > 0) {
        let p = this.Puntos.byId[puntos[0]]
        console.log('p', p)
      //  console.log("punto", this.state.puntosById, p)
        if(p) return [p.fields.Longitude, p.fields.Latitude]
        //if(p) this._map.flyTo([p.Longitude, p.Latitude])
      }
      return null
  }

  getPuntoFromTextoArray (textos) {
    let puntos = []
    textos.forEach((texto) => {
    //   console.log("fields", texto.item.fields.Puntos)
       if(texto.item.fields.Puntos && texto.item.fields.Puntos.length > 0) puntos.push(texto.item.fields.Puntos[0])
    })
    //  console.log(puntos)
      if (puntos.length > 0) {
        let p = this.Puntos.byId[puntos[0]]
        console.log('p', p)
      //  console.log("punto", this.state.puntosById, p)
      //  if(p) return [p.fields.Longitude, p.fields.Latitude]
        if(p) return p
        //if(p) this._map.flyTo([p.Longitude, p.Latitude])
      }
      return null
  }

  // to do: how to optimize?
  sortByDistance(point) {
    this.features.sort((a, b) => a)
  }

  // getNearestTexts(point, number) {
  //
  // }
// to do: possibly cache results of filtering or add author and book info as soon as downloaded?
  getTextsInBounds(bounds) {
    // let textos = {}
    // //console.log(bounds)
    // this.Puntos.all.map(id => this.Puntos.byId[id])
    //   .filter(punto => punto.fields.Latitude < bounds[0][1] && punto.fields.Latitude > bounds[1][1] && punto.fields.Longitude > bounds[1][0] && punto.fields.Longitude < bounds[0][0])
    //   .filter(punto => punto.fields.Textos)
    //   .forEach(punto => {
    //   //  console.log("punto", punto.fields)
    //   //  console.log("adding to array", punto, textos, punto.fields.Textos)
    //       punto.fields.Textos.forEach((id) => {
    //         textos[id] = this.Textos.byId[id]
    //       })
    //   })
    // return Object.keys(textos).map(id => {
    //     let texto = this.Textos.byId[id]
    //     let libro = this.Libros.byId[texto.fields.Libro[0]]
    //     let autor = this.Autores.byId[libro.fields.Autor[0]]
    //     let punto = this.Puntos.byId[texto.fields.Puntos[0]]
    //     return Object.assign({}, texto, {libro: libro, autor: autor, punto: punto})
    // })
  }
}

export default MapData