using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;
using static System.Net.Mime.MediaTypeNames;

namespace SynergicAPI.Controllers
{
    public class RecommendationController : ControllerBase
    {
        private readonly IConfiguration configuration;
        public RecommendationController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpGet]
        [Route("MarkVisit")]
        public async Task<DefaultResponse> MarkVisit(string userToken, int categoryVisited)
        {
            DefaultResponse response = new DefaultResponse();
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Account couldn't be found!";
                    return response;
                }

                string query = "SELECT RecommendationProfile FROM UserAccount WHERE ID = @ID";
                using (var command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ID", userID);

                    string userRecommendationProfile = (string)command.ExecuteScalar();
                    try
                    {
                        string filePath = Path.Combine(Environment.CurrentDirectory, "RecommendationData", "User - " + userRecommendationProfile + ".recfile");
                        string text = await System.IO.File.ReadAllTextAsync(filePath);
                        Dictionary<int, int> data = JsonConvert.DeserializeObject<Dictionary<int, int>>(text);
                        if(data.ContainsKey(categoryVisited))
                        {
                            data[categoryVisited]++;
                        }
                        else
                        {
                            data.Add(categoryVisited, 1);
                        }
                        await System.IO.File.WriteAllTextAsync(filePath, JsonConvert.SerializeObject(data, Formatting.Indented));
                    }
                    catch (Exception ex)
                    {
                        response.statusCode = (int)Utils.StatusCodings.Internal_Error;
                        response.statusMessage = "Couldn't open Recommendation Data folder, \nstack trace: " + ex;
                        return response;
                    }
                }
            }

            return response;
        }


        [HttpGet]
        [Route("GetRecommendation")]
        public async Task<ServiceElementsResponse> GetRecommendation(string userToken, int recommendationCount)
        {
            ServiceElementsResponse response = new ServiceElementsResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Account couldn't be found!";
                    return response;
                }
                Dictionary<int, int> data;

                string query = "SELECT RecommendationProfile FROM UserAccount WHERE ID = @ID";
                using (var command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ID", userID);

                    string userRecommendationProfile = (string)command.ExecuteScalar();
                    try
                    {
                        string filePath = Path.Combine(Environment.CurrentDirectory, "RecommendationData", "User - " + userRecommendationProfile + ".recfile");
                        string text = await System.IO.File.ReadAllTextAsync(filePath);
                        data = JsonConvert.DeserializeObject<Dictionary<int, int>>(text);
                    }
                    catch (Exception ex)
                    {
                        response.statusCode = (int)Utils.StatusCodings.Internal_Error;
                        response.statusMessage = "Couldn't open Recommendation Data folder, \nstack trace: " + ex;
                        return response;
                    }
                }
                data.OrderBy((e) => e.Value);

                int mostVisited = data.Keys.Take(1).ToArray()[0];

                query = $"SELECT TOP {recommendationCount} * FROM Services WHERE ServiceCategory = @ServiceCategory ORDER BY NEWID()";
                using (var command = new SqlCommand(query, con))
                {
                    command.Parameters.AddWithValue("@ServiceCategory", mostVisited);
                    command.Parameters.AddWithValue("@Count", recommendationCount);

                    List<ServiceElementResponse> tempList = new List<ServiceElementResponse>();
                    List<int> OwnersIDs = new List<int>();
                    List<int> ServicesIDs = new List<int>();

                    using (var reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ServiceElementResponse card = new ServiceElementResponse();
                            card.Title = (string)reader["ServiceTitle"];
                            card.Price = (int)reader["ServicePrice"];
                            card.Description = (string)reader["ServiceDescription"];
                            card.Category = (int)reader["ServiceCategory"];
                            card.ServiceID = (int)reader["ServiceID"];
                            tempList.Add(card);
                            OwnersIDs.Add((int)reader["OwnerID"]);
                            ServicesIDs.Add((int)reader["ServiceID"]);
                        }
                    }
                    //collect the required data from the different tables
                    for (int i = 0; i < tempList.Count; i++)
                    {
                        string getUserCommand = $"SELECT Username, ProfilePicture FROM UserAccount WHERE ID = @OwnerID";
                        using (SqlCommand userCommand = new SqlCommand(getUserCommand, con))
                        {
                            userCommand.Parameters.AddWithValue("@OwnerID", OwnersIDs[i]);

                            using (SqlDataReader userReader = userCommand.ExecuteReader())
                            {
                                if (userReader.Read())
                                {
                                    tempList[i].ServiceOwnerUsername = (string)userReader["Username"];
                                    tempList[i].ServiceOwnerPP = (byte[])userReader["ProfilePicture"];
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
                                tempList[i].Images = images.ToArray();
                            }
                        }
                        response.elements.Add(tempList[i]);
                    }
                }
            }
            return response;
        }
    }
}
