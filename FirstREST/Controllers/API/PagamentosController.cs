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
        
        
        public HttpResponseMessage Post(Lib_Primavera.Model.Pagamento pagamento)
        {
            Lib_Primavera.Model.RespostaErro erro = new Lib_Primavera.Model.RespostaErro();

            erro = Lib_Primavera.Comercial.Pagamento_Atualizar(pagamento);

            if (erro.Erro == 0)
            {
                var response = Request.CreateResponse(
                   HttpStatusCode.Created, "Valor pago com sucesso");
                string uri = Url.Link("DefaultApi", new { });
                response.Headers.Location = new Uri(uri);
                return response;
            }

            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest,erro.Descricao);
            }

        }
    }
}
