using System.Drawing;

namespace SynergicAPI.Models.Responses
{
    public class ServiceElementResponse : DefaultResponse
    {
        public SynergicUser user { get; set; }
        public string Title { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int Category { get; set; }
        public Bitmap[] Images { get; set; }
    }
}
