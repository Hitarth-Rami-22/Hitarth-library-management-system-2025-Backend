using LMS_API.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;


namespace LMS_API.Services
{
    public class PenaltyBackgroundService : BackgroundService

    {
        private readonly IServiceScopeFactory _scopeFactory;

            public PenaltyBackgroundService(IServiceScopeFactory scopeFactory)
            {
                _scopeFactory = scopeFactory;
            }

            protected override async Task ExecuteAsync(CancellationToken stoppingToken)
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    using var scope = _scopeFactory.CreateScope();
                    var borrowService = scope.ServiceProvider.GetRequiredService<IBorrowService>();

                    try
                    {
                        Console.WriteLine($"⏰ Running penalty task at {DateTime.Now}");
                        await borrowService.ApplyPenaltiesAsync();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"❌ Penalty task failed: {ex.Message}");
                    }

                    // Wait for 24 hours (or adjust to 12 * 60 * 60 for 12 hours)
                    await Task.Delay(TimeSpan.FromHours(24), stoppingToken);
                }
            }
        }
    }
