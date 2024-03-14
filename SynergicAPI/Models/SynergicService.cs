using System.Drawing;

namespace SynergicAPI.Models
{
    public class SynergicService
    {
        public SynergicUser user { get; set; }

        public string Title { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int Category { get; set; }
        public byte[][] Images { get; set; } //In base 64 form
    }
}
