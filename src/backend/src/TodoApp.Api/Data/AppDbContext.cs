using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Models;

namespace TodoApp.Api.Data;

/// <summary>
/// EF Core DbContext
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Todo> Todos => Set<Todo>();
    public DbSet<Priority> Priorities => Set<Priority>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Priority>(entity =>
        {
            entity.ToTable("priorities");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id)
                .HasColumnName("id")
                .HasColumnType("char(3)")
                .IsRequired();
            entity.Property(e => e.Name)
                .HasColumnName("name")
                .HasMaxLength(50)
                .IsRequired();
            entity.Property(e => e.ForegroundColor)
                .HasColumnName("foreground_color")
                .HasMaxLength(7)
                .IsRequired();
            entity.Property(e => e.BackgroundColor)
                .HasColumnName("background_color")
                .HasMaxLength(7)
                .IsRequired();
            entity.Property(e => e.DisplayOrder)
                .HasColumnName("display_order")
                .IsRequired();
            entity.Property(e => e.IsDeleted)
                .HasColumnName("is_deleted")
                .HasDefaultValue(false);
            entity.Property(e => e.CreatedAt)
                .HasColumnName("created_at");

            entity.HasData(
                new Priority { Id = "001", Name = "高", ForegroundColor = "#EF4444", BackgroundColor = "#FEE2E2", DisplayOrder = 1, IsDeleted = false, CreatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc) },
                new Priority { Id = "002", Name = "中", ForegroundColor = "#F97316", BackgroundColor = "#FFEDD5", DisplayOrder = 2, IsDeleted = false, CreatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc) },
                new Priority { Id = "003", Name = "低", ForegroundColor = "#3B82F6", BackgroundColor = "#DBEAFE", DisplayOrder = 3, IsDeleted = false, CreatedAt = new DateTime(2026, 4, 10, 0, 0, 0, DateTimeKind.Utc) }
            );
        });

        modelBuilder.Entity<Todo>(entity =>
        {
            entity.ToTable("todos");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
            entity.Property(e => e.Text).HasColumnName("text").HasMaxLength(200).IsRequired();
            entity.Property(e => e.Completed).HasColumnName("completed").HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.DueDate).HasColumnName("due_date").HasColumnType("date").IsRequired(false);
            entity.Property(e => e.PriorityId)
                .HasColumnName("priority_id")
                .HasColumnType("char(3)")
                .IsRequired(false);
            entity.HasOne(e => e.Priority)
                .WithMany(p => p.Todos)
                .HasForeignKey(e => e.PriorityId)
                .HasConstraintName("FK_todos_priorities_priority_id")
                .OnDelete(DeleteBehavior.SetNull);
        });
    }
}
