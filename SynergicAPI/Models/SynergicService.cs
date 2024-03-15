using System.Drawing;

namespace SynergicAPI.Models
{
    public class SynergicService //this is used when creating a service
    {
        public SynergicUser user { get; set; }

        public string Title { get; set; }
        public int Price { get; set; }
        public string Description { get; set; }
        public int Category { get; set; }
        public byte[][] Images { get; set; } //In base 64 form
    }

    public class SynergicServices //this is used to get services for the explore page.
    {
        public SynergicUser user { get; set; }
        public int Count { get; set; } //how many services to get
        public int Offset { get; set; } //the offset of the services -skip the first 'Offset' Services-
        public int Price { get; set; } //set to -1 to ignore price filter.
        public int Category { get; set; } //set to -1 to ignore category filter.
        public string Title { get; set; } //leave empty to ignore title filter.

    }
}
