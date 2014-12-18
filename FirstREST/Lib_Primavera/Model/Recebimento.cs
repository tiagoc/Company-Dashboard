using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FirstREST.Lib_Primavera.Model
{
    public class Recebimento
    {
        public string Nome
        {
            get;
            set;
        }
        public string Entidade
        {
            get;
            set;
        }
        public double ValorTotal
        {
            get;
            set;
        }
        public double ValorPendente
        {
            get;
            set;
        }
        public string NumDoc
        {
            get;
            set;
        }
    }
}