namespace SynergicAPI.Models
{
    public class PaymentInfo
    {
        public SynergicUser user { get; set; }
        public string CardholderName { get; set; }
        public string CardNumber {  get; set; }
        public int expMonth { get; set; }
        public int expYear { get; set; }
        public int CVC { get; set; }
        public bool IsVendor { get; set; }
    }
}
