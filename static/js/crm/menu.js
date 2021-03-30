

if( ! window.next ) window.next = {};

window.next.menu = [
			/*{
				"id" : 1,
				"menuid" : "sub-menu-1",
				"groupname" : "Administração Geral",
				"icon" : "mdi mdi-monitor",
				"itens" : [
					{
						"id" : 1,
						"menuname" : "Consultores",
						"link" : "/pages/dream/list?entity=dream_consultor"
					}
				]
			}, */
	    	{
				"id" : 2,
				"menuid" : "sub-menu-1",
				"groupname" : "Cadastros",
				"icon" : "mdi mdi-archive",
				"itens" : [
					{
						"id" : 1,
						"menuname" : "Dashboard",
						"link" : "/render/dream/dashboard"
					},
					{
						"id" : 1,
						"menuname" : "Categorias",
						"link" : "/pages/dream/list?entity=dream_category"
					},
					{
						"id" : 2,
						"menuname" : "Empresas",
						"link" : "/pages/dream/list?entity=dream_company"
					},
					/*{
						"id" : 3,
						"menuname" : "Planos",
						"link" : "/pages/dream/list?entity=dream_product"
					}, */
					{
						"id" : 4,
						"menuname" : "Condições de pagamento",
						"link" : "/pages/dream/list?entity=dream_paymentconditions"
					},
					{
						"id" : 5,
						"menuname" : "Lead's",
						"link" : "/pages/dream/list?entity=dream_lead"
					},
					{
						"id" : 6,
						"menuname" : "Status do Lead's",
						"link" : "/pages/dream/list?entity=dream_leadstatus"
					},
					{
						"id" : 7,
						"menuname" : "Usuários",
						"link" : "/pages/dream/list?entity=users"
					}
				]

			},
			{
				"id" : 1,
				"menuid" : "sub-menu-1",
				"groupname" : "Formulários",
				"icon" : "mdi mdi-monitor",
				"itens" : [
					{
						"id" : 1,
						"menuname" : "Visitas",
						"link" : "/pages/dream/list?entity=dream_visita"
					},
					{
						"id" : 1,
						"menuname" : "Ligações",
						"link" : "/pages/dream/list?entity=dream_call"
					}
				]
			}
			
	    ]


window.next.alternativeMenu = [
			
	    	{
				"id" : 2,
				"menuid" : "sub-menu-1",
				"groupname" : "Cadastros",
				"icon" : "mdi mdi-archive",
				"itens" : [
					{
						"id" : 1,
						"menuname" : "Dashboard",
						"link" : "/render/dream/dashboard"
					},
					{
						"id" : 5,
						"menuname" : "Lead's",
						"link" : "/pages/dream/list?entity=dream_lead"
					}
				]

			},
			{
				"id" : 1,
				"menuid" : "sub-menu-1",
				"groupname" : "Formulários",
				"icon" : "mdi mdi-monitor",
				"itens" : [
					{
						"id" : 1,
						"menuname" : "Visitas",
						"link" : "/pages/dream/list?entity=dream_visita"
					},
					{
						"id" : 1,
						"menuname" : "Ligações",
						"link" : "/pages/dream/list?entity=dream_call"
					}
				]
			}
			
	    ]