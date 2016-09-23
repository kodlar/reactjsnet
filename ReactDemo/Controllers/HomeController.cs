using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using ReactDemo.Models;

namespace ReactDemo.Controllers
{
    public class HomeController : Controller
    {
        private static readonly IList<CommentModel> _comments;

        static HomeController()
        {
            _comments = new List<CommentModel>
                        {
                            new CommentModel
                            {
                                Author = "Daniel Lo Nigro",
                                Text = "Hello ReactJS.NET World!"
                            },
                            new CommentModel
                            {
                                Author = "Pete Hunt",
                                Text = "This is one comment"
                            },
                            new CommentModel
                            {
                                Author = "Jordan Walke",
                                Text = "This is *another* comment"
                            }
                        };

        }
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [OutputCache(Location = OutputCacheLocation.None)]
        public ActionResult Comments()
        {
            return this.Json(_comments, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddComment(CommentModel comment)
        {
            _comments.Add(comment);
            return Content("Success :)");
        }
    }
}