using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using FirstREST.Lib_Primavera.Model;

namespace FirstREST.Controllers.API
{
    public class FornecedoresController : ApiController
    {
        //

        // GET: api/fornecedores/

        public IEnumerable<Lib_Primavera.Model.Fornecedor> Get()
        {
            return Lib_Primavera.Comercial.ListaFornecedores();
        }


        // GET api/fornecedor/5    
        public Fornecedor Get(string id)
        {
            Lib_Primavera.Model.Fornecedor fornecedor = Lib_Primavera.Comercial.GetFornecedor(id);
            if (fornecedor == null)
            {
                throw new HttpResponseException(
                        Request.CreateResponse(HttpStatusCode.NotFound));

            }
            else
            {
                return fornecedor;
            }
        }
    }
}
