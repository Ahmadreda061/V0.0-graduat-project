using Newtonsoft.Json;
using SynergicAPI.Models.NotificationTypes;
using System.Drawing;

namespace SynergicAPI.Models.Responses
{
    public class NotificationsResponse : DefaultResponse
    {
        public string[] Notifications { get; set; }
    }
}
