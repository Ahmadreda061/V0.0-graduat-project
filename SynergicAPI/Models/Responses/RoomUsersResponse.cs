namespace SynergicAPI.Models.Responses
{
    public class RoomUsersResponse : DefaultResponse
    {
        public List<RoomUserData> users { get; set; }

        public RoomUsersResponse()
        {
            this.users = new List<RoomUserData>();
        }
    }
    public class RoomUserData
    {
        public string Username { get; set; }
        public byte[] UserPP { get; set; }
    }
}
