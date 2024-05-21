using SynergicAPI.Models.Notifications;

namespace SynergicAPI.Models.Responses
{
    public class NotificationsResponse : DefaultResponse
    {
        public List<SynergicNotification> Notifications { get; set; }
    }
}
