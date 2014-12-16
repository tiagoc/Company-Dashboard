using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FirstREST.Lib_Primavera.Model;


namespace FirstREST.Controllers.API
{
    public class PagamentosController : ApiController
    {
        public IEnumerable<Lib_Primavera.Model.Pagamento> Get()
        {
            return Lib_Primavera.Comercial.ListarPagamentosPendentes();
        }
    }
}
