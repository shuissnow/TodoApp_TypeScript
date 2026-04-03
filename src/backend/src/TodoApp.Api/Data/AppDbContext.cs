using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Models;

namespace TodoApp.Api.Data;

/// <summary>
/// EF Core DbContext
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Todo>(entity =>
        {
            entity.ToTable("todos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Text).HasColumnName("text").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Completed).HasColumnName("completed").HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
        });
    }
}
