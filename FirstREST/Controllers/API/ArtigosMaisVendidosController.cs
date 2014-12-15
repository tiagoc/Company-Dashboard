using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FirstREST.Controllers.API
{
    public class ArtigosMaisVendidosController : ApiController
    {

        public List<Dictionary<string, string>> Get()
        {
            return Lib_Primavera.Comercial.ListaTopArtigoVendido();
        }
    }
}
