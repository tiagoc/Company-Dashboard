using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace FirstREST.Controllers.API
{
    public class HistoricoController : ApiController
    {

        //
        // GET: /Historico/

        public IEnumerable<Lib_Primavera.Model.Historico> Get()
        {
            return Lib_Primavera.Comercial.GetHistorico();
        }
    }
}
