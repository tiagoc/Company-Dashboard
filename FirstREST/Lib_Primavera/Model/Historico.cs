using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace FirstREST.Lib_Primavera.Model
{
    public class Historico
    {
        public string Entidade
        {
            get;
            set;
        }
        public string TipoDoc
        {
            get;
            set;
        }
        public string NumDoc
        {
            get;
            set;
        }
        public string Data
        {
            get;
            set;
        }
        public double ValorTotal
        {
            get;
            set;
        }
        public string TipoEntidade
        {
            get;
            set;
        }
    }
}