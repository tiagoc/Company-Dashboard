var profile = {
    basePath: "../",
    releaseDir: "release",
    layerOptimize: "shrinksafe",
    hasReport: true,
    clean: true,
    stripConsole: "all",

    packages: [

        {
            name: "dojo",
            location: "dojo"
        },
        {
            name: "dijit",
            location: "dijit"
        },
         {
             name: "dojox",
             location: "dojox"
         },
          {
              name: "app",
              location: "app"
          },
              {
                  name: "klt",
                  location: "klt"
              }

    ],
   
    resourceTags: {
        amd: function (filename, mid) {
            return /\.js$/.test(filename);
        }
    },


}
