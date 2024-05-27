using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SynergicAPI.Models;
using SynergicAPI.Models.Notifications.NotificationTypes;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;
using System.Drawing;
using System.Text;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ServicesController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpPost]
        [Route("AddService")]
        public DefaultResponse AddService(SynergicService service)
        {
            DefaultResponse response = new DefaultResponse();


            if (service.Images.Length < 0)
            {
                response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                response.statusMessage = "Service Error: You need one or more Images for the Service!";
                return response;
            }

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the user
                if (!Utils.IsLegitUserTokenWithID(con, service.userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                    response.statusMessage = "The password doesn't match with the expected one for the UserToken.";
                    return response;
                }

                string query = $"INSERT INTO {Utils.ServicesString} " +
                                                       "VALUES (@OwnerID, @ServiceTitle, @ServicePrice, @ServiceDescription, @ServiceCategory)";

                //inserts the service into the DB
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@OwnerID", userID);
                    cmd.Parameters.AddWithValue("@ServiceTitle", service.Title);
                    cmd.Parameters.AddWithValue("@ServicePrice", service.Price);
                    cmd.Parameters.AddWithValue("@ServiceDescription", service.Description);
                    cmd.Parameters.AddWithValue("@ServiceCategory", service.Category);

                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected <= 0)//Query failed to execute.
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "Service Error: An unexpected error has occurred while registering the Service!";
                        return response;
                    }
                }
                //Gets the ID of the Service so we can add a record -that requires the ServiceID as a foreign key- into ServicesImages for each provided image
                int ServiceID = Utils.GetServiceID(con, service, userID);

                //Insert each image into the DB
                query = $"INSERT INTO {Utils.ServicesImagesString} " +
               "VALUES (@ServiceID, @ImageData)";
                foreach (var img in service.Images)
                {
                    using (SqlCommand insertImageCommand = new SqlCommand(query, con))
                    {
                        insertImageCommand.Parameters.AddWithValue("@ServiceID", ServiceID);
                        insertImageCommand.Parameters.AddWithValue("@ImageData", img);//converting the img base64 into byte[]
                        insertImageCommand.ExecuteNonQuery();
                    }
                }
                return response;
            }
        }

        [HttpGet]
        [Route("GetServices")]
        public ServiceElementsResponse GetServices(string? Username, string? Title, string? SearchBar, int? Price, string? Category, int? UserRating, int Count, int Offset)
        {
            ServiceElementsResponse response = new ServiceElementsResponse();


            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                if (Count > 0)
                {
                    //builds the query depending on the given filters, each filter is 'AND'ed with others
                    var queryBuilder = new StringBuilder("SELECT * FROM Services ");
                    int[] Categories = null;

                    if (!string.IsNullOrEmpty(Title) || !string.IsNullOrEmpty(Username) || !string.IsNullOrEmpty(SearchBar) || Price > 0 || Category != null)
                    {
                        queryBuilder.Append("WHERE ");

                        if (!string.IsNullOrEmpty(Title))
                        {
                            queryBuilder.Append("(ServiceTitle LIKE '%'@ServiceTitle'%' OR ServiceDescription LIKE '%'@ServiceDescription'%') AND ");
                        }
                        if (!string.IsNullOrEmpty(Username))
                        {
                            queryBuilder.Append("OwnerID IN (SELECT ID FROM UserAccount WHERE Username LIKE @Username) AND ");
                        }
                        if (!string.IsNullOrEmpty(SearchBar))
                        {
                            queryBuilder.Append("(OwnerID IN (SELECT ID FROM UserAccount WHERE Username LIKE '%'@SearchBar1'%') OR (ServiceTitle LIKE '%'@SearchBar2'%' OR ServiceDescription LIKE '%'@SearchBar3'%')) AND ");
                        }
                        if (Price > 0)
                        {
                            queryBuilder.Append("ServicePrice <= @ServicePrice AND ");
                        }
                        if (Category != null)
                        {
                            Categories = Category.Split(',').Select((e) => int.Parse(e)).ToArray();
                            string cats = "";
                            for (int i = 0; i < Categories.Length; i++)
                            {
                                cats += $"@Category{i}";
                                if (i < Categories.Length - 1)
                                {
                                    cats += ", ";
                                }
                            }
                            queryBuilder.Append($"ServiceCategory IN ({cats}) AND ");
                        }

                        // Remove trailing "AND" if it exists
                        queryBuilder.Replace("AND ", "", queryBuilder.Length - 5, 5);
                    }

                    queryBuilder.Append("ORDER BY (SELECT NULL) OFFSET @Offset ROWS FETCH NEXT @Count ROWS ONLY");

                    List<ServiceElementData> responseElements = new List<ServiceElementData>();
                    //gets the services with the given filters
                    using (SqlCommand command = new SqlCommand(queryBuilder.ToString(), con))
                    {
                        if (!string.IsNullOrEmpty(Title))
                        {
                            command.Parameters.AddWithValue("@ServiceTitle", $"%{Title}%");
                            command.Parameters.AddWithValue("@ServiceDescription", $"%{Title}%");
                        }
                        if (!string.IsNullOrEmpty(Username)) command.Parameters.AddWithValue("@Username", Username);

                        if (!string.IsNullOrEmpty(SearchBar))
                        {
                            command.Parameters.AddWithValue("@SearchBar1", SearchBar);
                            command.Parameters.AddWithValue("@SearchBar2", SearchBar);
                            command.Parameters.AddWithValue("@SearchBar3", SearchBar);
                        }

                        if (Price > 0) command.Parameters.AddWithValue("@ServicePrice", Price);
                        if (Categories != null)
                        {
                            for (int i = 0; i < Categories.Length; i++)
                            {
                                command.Parameters.AddWithValue($"@Category{i}", Categories[i]);
                            }
                        }
                        command.Parameters.AddWithValue("@Offset", Offset);
                        command.Parameters.AddWithValue("@Count", Count);

                        // Load data into a temporary lists
                        List<int> OwnersIDs = new List<int>();
                        List<int> ServicesIDs = new List<int>();

                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                ServiceElementData card = new ServiceElementData();
                                card.Title = (string)reader["ServiceTitle"];
                                card.Price = (int)reader["ServicePrice"];
                                card.Description = (string)reader["ServiceDescription"];
                                card.Category = (int)reader["ServiceCategory"];
                                card.ServiceID = (int)reader["ServiceID"];
                                responseElements.Add(card);
                                OwnersIDs.Add((int)reader["OwnerID"]);
                                ServicesIDs.Add((int)reader["ServiceID"]);
                            }
                        }

                        //collect the required data from the different tables
                        for (int i = 0; i < responseElements.Count; i++)
                        {
                            string getUserCommand = $"SELECT Username, ProfilePicture FROM UserAccount WHERE ID = @OwnerID";
                            using (SqlCommand userCommand = new SqlCommand(getUserCommand, con))
                            {
                                userCommand.Parameters.AddWithValue("@OwnerID", OwnersIDs[i]);

                                using (SqlDataReader userReader = userCommand.ExecuteReader())
                                {
                                    if (userReader.Read())
                                    {
                                        responseElements[i].ServiceOwnerUsername = (string)userReader["Username"];
                                        responseElements[i].ServiceOwnerPP = (byte[])userReader["ProfilePicture"];
                                    }
                                }
                            }

                            string GetImagesCommand = $"SELECT ImageData FROM ServicesImages WHERE ServiceID = @ServiceID";
                            using (SqlCommand imagesCommand = new SqlCommand(GetImagesCommand, con))
                            {
                                imagesCommand.Parameters.AddWithValue("@ServiceID", ServicesIDs[i]);

                                using (SqlDataReader imageReader = imagesCommand.ExecuteReader())
                                {
                                    List<byte[]> images = new List<byte[]>();
                                    while (imageReader.Read())
                                    {
                                        images.Add((byte[])imageReader["ImageData"]);
                                    }
                                    responseElements[i].Images = images.ToArray();
                                }
                            }
                        }

                        if (UserRating != null)
                        {
                            AccountsController ac = new AccountsController(configuration);
                            for (int i = 0; i < responseElements.Count; i++)
                            {
                                if (MathF.Floor(ac.GetUserRating(responseElements[i].ServiceOwnerUsername).Rating) == UserRating)
                                {
                                    response.elements.Add(responseElements[i]);
                                }
                            }
                        }
                        else
                        {
                            response.elements = responseElements;
                        }
                    }
                }
            }
            return response;
        }

        [HttpDelete]
        [Route("DeleteService")]
        public DefaultResponse DeleteService(string userToken, string serviceID)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the user
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusMessage = "the given userToken is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    return response;
                }

                //Validate the service existance, and checks if the give user is the owner of this service
                string query = "SELECT UserToken FROM UserAccount WHERE ID = (SELECT OwnerID FROM Services WHERE ServiceID = @ServiceID)";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ServiceID", serviceID);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (!reader.HasRows)
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                            response.statusMessage = "Service couldn't be found!";
                            return response;
                        }

                        if (!reader.Read() || !userToken.Equals((string)reader["UserToken"]))
                        {
                            response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                            response.statusMessage = "The Owner of the service doesn't match the given owner";
                            return response;
                        }
                    }
                }

                //Deletes the service from the DB
                query = "DELETE FROM ServicesImages WHERE ServiceID = @ServiceID1; DELETE FROM ServiceRequests WHERE RequestedServiceID = @ServiceID2; DELETE FROM Services WHERE ServiceID = @ServiceID3";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ServiceID1", serviceID);
                    command.Parameters.AddWithValue("@ServiceID2", serviceID);
                    command.Parameters.AddWithValue("@ServiceID3", serviceID);
                    command.ExecuteNonQuery();
                }
            }
            return response;
        }

        [HttpGet]
        [Route("RequestService")]
        public DefaultResponse RequestService(string userToken, int ServiceID, string? AdditionalComment)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the user
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in userToken";
                    return response;
                }

                //Checks if there is a service with this id
                string query = $"SELECT ServiceID From Services WHERE ServiceID = @ServiceID";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);

                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.Read())
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                            response.statusMessage = "Error in serviceID, Service not found";
                            return response;
                        }
                    }
                }

                //Checks if the user already has an active request for this service
                query = $"SELECT RequestedServiceID From ServiceRequests WHERE RequesterID = @RequesterID AND RequestedServiceID = @RequestedServiceID";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@RequesterID", userID);
                    command.Parameters.AddWithValue("@RequestedServiceID", ServiceID);

                    using (var reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Already_Requested;
                            response.statusMessage = "Service already requested";
                            return response;
                        }
                    }
                }

                //Adds the service request
                query = $"INSERT INTO {Utils.ServiceRequestsString} VALUES(@RequesterID, @RequestedServiceID, @AdditionalComment)";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@RequesterID", userID);
                    command.Parameters.AddWithValue("@RequestedServiceID", ServiceID);
                    command.Parameters.AddWithValue("@AdditionalComment", AdditionalComment);

                    int count = command.ExecuteNonQuery();
                    if (count == 0)//this shouldn't be reachable, but just in case i will leave it
                    {
                        response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                        response.statusMessage = "Error in serviceID, Service where not found";
                        return response;
                    }
                }


                //All succeeded so far, now send notification for the ServiceOwner
                string senderName = Utils.UserIDToUsername(con, userID);
                ServiceRequestNotification content = new ServiceRequestNotification()
                {
                    messageContent = $"{senderName} Is requesting the service ({Utils.ServiceIDToServiceTitle(con, ServiceID)})",
                    sendTime = DateTime.Now,
                };

                if (AdditionalComment != null && !string.IsNullOrEmpty(AdditionalComment) && !string.IsNullOrWhiteSpace(AdditionalComment))
                    content.messageContent += $", saying: {AdditionalComment}";

                query = $"INSERT INTO {Utils.NotificationsString} VALUES(@SenderID, (SELECT OwnerID FROM Services WHERE ServiceID = @ServiceID), @NotificationCategory, @IsRead, @Content)";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@SenderID", userID);
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);
                    command.Parameters.AddWithValue("@NotificationCategory", (int)Utils.NotificationCategory.ServiceRequest);
                    command.Parameters.AddWithValue("@IsRead", false);
                    command.Parameters.AddWithValue("@Content", JsonConvert.SerializeObject(content));

                    int count = command.ExecuteNonQuery();
                    if (count == 0)
                    {
                        response.statusMessage = "An unknown error happened while sending a notification";
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        return response;
                    }
                }
            }
            return response;
        }

        [HttpDelete]
        [Route("DeleteServiceRequest")]
        public DefaultResponse DeleteServiceRequest(string userToken, int ServiceID)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the user
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in userToken";
                    return response;
                }

                //Checks if the user already has an active request for this service
                string query = $"SELECT RequestedServiceID From ServiceRequests WHERE RequesterID = @RequesterID AND RequestedServiceID = @RequestedServiceID";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@RequesterID", userID);
                    command.Parameters.AddWithValue("@RequestedServiceID", ServiceID);

                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.HasRows)
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Request_Not_Found;
                            response.statusMessage = "Service request not found";
                            return response;
                        }
                    }
                }

                //Delete the service request
                query = $"DELETE From ServiceRequests WHERE RequesterID = @RequesterID AND RequestedServiceID = @RequestedServiceID";
                using (SqlCommand command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@RequesterID", userID);
                    command.Parameters.AddWithValue("@RequestedServiceID", ServiceID);

                    int count = command.ExecuteNonQuery();
                    if (count == 0)//this shouldn't be reachable, but just in case i will leave it
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "This Should never be possible!";
                        return response;
                    }
                }
            }
            return response;
        }

        [HttpPost]
        [Route("AcceptServiceRequest")]
        public AcceptServiceResponse AcceptServiceRequest(string UserToken, int ServiceID, string RequesterName)
        {
            AcceptServiceResponse response = new AcceptServiceResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the userToken
                if (!Utils.IsLegitUserTokenWithID(con, UserToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in userToken";
                    return response;
                }

                //Validate the RequesterName
                if (!Utils.UsernameToUserID(con, RequesterName, out int RequesterID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in RequesterName";
                    return response;
                }

                //Checks if there is a service with this id
                using (SqlCommand command = new SqlCommand($"SELECT ServiceID From Services WHERE ServiceID = @ServiceID", con))
                {
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);
                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.Read())
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                            response.statusMessage = "Error in serviceID, Service not found";
                            return response;
                        }
                    }
                }

                //Checks if the provided user is the correct owner of the service
                if (!Utils.IsServiceOwner(con, ServiceID, UserToken))
                {
                    response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                    response.statusMessage = "The provided user from UserToken isn't the owner of the provided service";
                    return response;
                }

                //The customer get's charged with the price of the service, and the money is sent to the website account to prevent fraud and to pay the vendor later after completing the service successfully with their cut of the payment.

                //Delete the service request from the database as it is no longer needed
                using (SqlCommand command = new SqlCommand("DELETE FROM ServiceRequests WHERE RequesterID = @RequesterID AND RequestedServiceID = @ServiceID", con))
                {
                    command.Parameters.AddWithValue("@RequesterID", RequesterID);
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);

                    int ra = command.ExecuteNonQuery();
                    if (ra == 0)//Shouldn't happen in any case
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "An unknown error happened while trying to delete the service";
                    }
                }

                //Create a record for the newly accepted service request
                using (SqlCommand command = new SqlCommand($"INSERT INTO {Utils.ActiveServicesString} VALUES(@ServiceID1, @CutomerID, @ActiveStatus, (SELECT ServicePrice FROM Services WHERE @ServiceID = ServiceID2))", con))
                {
                    command.Parameters.AddWithValue("@ServiceID1", ServiceID);
                    command.Parameters.AddWithValue("@CutomerID", RequesterID);
                    command.Parameters.AddWithValue("@ActiveStatus", true);
                    command.Parameters.AddWithValue("@ServiceID2", ServiceID);

                    int ra = command.ExecuteNonQuery();
                    if (ra == 0)//Shouldn't happen in any case
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "An unknown error happened while trying to activate the service";
                    }
                }

                //Get the id of the created active service
                using (SqlCommand command = new SqlCommand("SELECT ID FROM ActiveServices WHERE ServiceID = @ServiceID AND CutomerID = @CutomerID)", con))
                {
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);
                    command.Parameters.AddWithValue("@CutomerID", RequesterID);

                    using(SqlDataReader reader = command.ExecuteReader())
                    {
                        if(!reader.HasRows)//Shouldn't be reachable
                        {
                            response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                            response.statusMessage = "An unknown error happened while trying to get the id of the active service";
                        }

                        while (reader.Read())//this will make sure that we have the latest activated service
                        {
                            response.ActiveServiceID = (int)reader["ID"];
                        }
                    }
                }
            }
            return response;
        }
        
        [HttpPost]
        [Route("RejectServiceRequest")]
        public DefaultResponse RejectServiceRequest(string UserToken, int ServiceID, string RequesterName)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                //Validate the userToken
                if (!Utils.IsLegitUserTokenWithID(con, UserToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in userToken";
                    return response;
                }
               
                //Validate the RequesterName
                if (!Utils.UsernameToUserID(con, RequesterName, out int RequesterID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in RequesterName";
                    return response;
                }
                
                //Checks if there is a service with this id
                using (SqlCommand command = new SqlCommand($"SELECT ServiceID From Services WHERE ServiceID = @ServiceID", con))
                {
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);
                    using (var reader = command.ExecuteReader())
                    {
                        if (!reader.Read())
                        {
                            response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                            response.statusMessage = "Error in serviceID, Service not found";
                            return response;
                        }
                    }
                }
                
                //Checks if the provided user is the correct owner of the service
                if (!Utils.IsServiceOwner(con, ServiceID, UserToken))
                {
                    response.statusCode = (int)Utils.StatusCodings.Service_Not_Found;
                    response.statusMessage = "The provided user from UserToken isn't the owner of the provided service";
                    return response;
                }

                //Delete the service request from the database as it was rejected
                using (SqlCommand command = new SqlCommand("DELETE FROM ServiceRequests WHERE RequesterID = @RequesterID AND RequestedServiceID = @ServiceID", con))
                {
                    command.Parameters.AddWithValue("@RequesterID", RequesterID);
                    command.Parameters.AddWithValue("@ServiceID", ServiceID);

                    int ra = command.ExecuteNonQuery();
                    if(ra == 0)//Shouldn't happen in any case
                    {
                        response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                        response.statusMessage = "An unknown error happened while trying to delete the service";
                    }
                }
            }
            return response;
        }

        [HttpPost]
        [Route("CancleActiveService")]
        public DefaultResponse CancleActiveService(string UserToken, int ActiveServiceID)
        {
            DefaultResponse response = DisableActiveService(UserToken, ActiveServiceID);

            //Start payment countdown so when the cooldown time is over, the customer gets their money back
            return response;
        }
        [HttpPost]
        [Route("FinishActiveService")]
        public DefaultResponse FinishActiveService(string UserToken, int ActiveServiceID)//temp
        {
            DefaultResponse response = CancleActiveService(UserToken, ActiveServiceID);//Disable the Active Service so the customer still have a chance to review with the vendor or the moderators

            //Start payment countdown so when the review time is over, the vendor gets their cut of the payment

            return response;
        }


        DefaultResponse DisableActiveService(string UserToken, int ActiveServiceID)
        {
            DefaultResponse response = new DefaultResponse();
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                //Validate the userToken
                if (!Utils.IsLegitUserTokenWithID(con, UserToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Error in userToken";
                    return response;
                }

                using (SqlCommand command = new SqlCommand("UPDATE ActiveServices SET ActiveStatus = @ActiveStatus WHERE ID = @ActiveServiceID AND (CustomerID = @CustomerID OR EXISTS (SELECT 1 FROM Services WHERE ServiceID = ActiveServices.ServiceID AND OwnerID = @OwnerID))", con))
                {
                    command.Parameters.AddWithValue("@ActiveStatus", false);
                    command.Parameters.AddWithValue("@ActiveServiceID", ActiveServiceID);
                    command.Parameters.AddWithValue("@CustomerID", userID);
                    command.Parameters.AddWithValue("@OwnerID", userID);

                    int ra = command.ExecuteNonQuery();
                    if (ra == 0)
                    {
                        response.statusCode = (int)Utils.StatusCodings.Active_Service_Not_Found;
                        response.statusMessage = "Active Service Not Found";
                        return response;
                    }
                }
            }
            return response;
        }
    }
}
