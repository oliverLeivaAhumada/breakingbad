//propiedades de service worked

//Estrategias de cache en PWA
//1.- cache only: la aplicacion se carga siempre del cache(va una vez a la red y nunca mas)
//2.-cache with network fallback: veo el cache, si no esta me voy a la network
//3.-network with cache fallback: voy a la red pero si la red no existe, cargo de cache 
//4.-cache dinamico: una combi de las 3 estrategias de cache
//si un elemento no esta en el cache, lo guardo para la proxima peticion.
//no tienes seguridad de los elementos que van a ser cargados en cache.

//esto se ejecuta una vez cuando el service worker es instalado

//APP SHELL: son los elementos que requiere si o si la web para funcionar
//los recursos

const APP_SHELL = [
    "/",
    "/index.html",
    "/vendor/fontawesome-free-5.15.1-web/css/all.min.css",
    "/css/style.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    "/img/logo.png",
    "/ubicaciones.html",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@10",
    "/js/init.js"
];
// DEL CONTENIDO DEL APP SHELL, QUE COSAS JAMAS DEBERIA CAMBIAR
const APP_SHELL_INMUTABLE =[
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js",
    "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
    "https://cdn.jsdelivr.net/npm/sweetalert2@10"
]
const CACHE_ESTATICO = "estatico-v1";
const CACHE_INMUTABLE = "inmutable-v1";


// se ejecuta una vez cuando el service es instalado
self.addEventListener('install', e=>{
    //console.log("el servicio worker fue instalado");
    //INICIALIZAR EL CACHE

    //programaticamente cuando llegue fetch voy a cambiarlo
    const cacheEstatico = caches.open(CACHE_ESTATICO).then(cache=>cache.addAll(APP_SHELL));
    //este cache no se camibar nunca
    const cacheInmutable = caches.open(CACHE_INMUTABLE).then(cache=>cache.addAll(APP_SHELL_INMUTABLE));
    //equivalente a la await
    //voy a esperar las 2 promesas al mismo tiempo
    e.waitUntil(Promise.all([cacheEstatico,cacheInmutable]));
});


//se ejecuta una vez el service worked este activado
self.addEventListener('activate', e=>{
    //Limpiar caches antiguos
    console.log("el servicio worker fue activado");
});

//esto se ejecuta por cada una de las peticiones que haga el navegador
self.addEventListener('fetch', e=>{
    //preguntarme si la peticion que estoy recibiendo se encuentra dentro de algun cache.
    //si se escuentra en el cache la voy a servir desde ahi,  sino voy a buscarla a la red
    //cache con network Fallback    
    const respuesta = caches.match(e.request).then(res=>{
        if(res && !e.request.url.includes("/api")){
            return res;
        } else {
            const petInternet = fetch(e.request).then(newRes=>{
                if(newRes.ok || newRes.type =='opaque'){
                    return caches.open("dinamico-v1").then(cache=>{
                        cache.put(e.request, newRes);
                        return newRes.clone();
                    });
                }else{ 
                    console.log(newRes);
                    return newRes;
                }
            }).catch(error=>caches.match(e.request));
            return petInternet;
        }
    });
    e.respondWith(respuesta);
});

