using Moq;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;

namespace TodoApp.Api.Tests.Services;

public class TodoServiceTests
{
    private readonly Mock<ITodoRepository> _repositoryMock = new();
    private readonly TodoService _sut;

    public TodoServiceTests()
    {
        _sut = new TodoService(_repositoryMock.Object);
    }

    // --- GetAllAsync ---

    [Fact]
    public async Task GetAllAsync_ReturnsAllTodos()
    {
        List<Todo> todos = new List<Todo>
        {
            new() { Id = Guid.NewGuid(), Text = "タスク1", Completed = false, CreatedAt = DateTime.UtcNow },
            new() { Id = Guid.NewGuid(), Text = "タスク2", Completed = true, CreatedAt = DateTime.UtcNow },
        };
        _repositoryMock.Setup(r => r.GetAllAsync()).ReturnsAsync(todos);

        IEnumerable<Todo> result = await _sut.GetAllAsync();

        Assert.Equal(2, result.Count());
    }

    // --- CreateAsync ---

    [Fact]
    public async Task CreateAsync_CreatesAndReturnsTodo()
    {
        CreateTodoRequest request = new CreateTodoRequest { Text = "新しいタスク" };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);

        Assert.Equal("新しいタスク", result.Text);
        Assert.False(result.Completed);
        Assert.NotEqual(Guid.Empty, result.Id);
    }

    [Fact]
    public async Task CreateAsync_TrimsWhitespaceFromText()
    {
        CreateTodoRequest request = new CreateTodoRequest { Text = "  スペースあり  " };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);

        Assert.Equal("スペースあり", result.Text);
    }

    [Fact]
    public async Task CreateAsync_SetsCreatedAtToUtcNow()
    {
        DateTime before = DateTime.UtcNow;
        CreateTodoRequest request = new CreateTodoRequest { Text = "タスク" };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);
        DateTime after = DateTime.UtcNow;

        Assert.True(result.CreatedAt >= before && result.CreatedAt <= after);
    }

    // --- UpdateAsync ---

    [Fact]
    public async Task UpdateAsync_ReturnsNull_WhenTodoNotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Todo?)null);

        Todo? result = await _sut.UpdateAsync(Guid.NewGuid(), new UpdateTodoRequest { Text = "更新" });

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesText_WhenTextProvided()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "更新後" });

        Assert.Equal("更新後", result!.Text);
    }

    [Fact]
    public async Task UpdateAsync_UpdatesCompleted_WhenCompletedProvided()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.True(result!.Completed);
    }

    [Fact]
    public async Task UpdateAsync_DoesNotChangeText_WhenTextIsNull()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.Equal("元のテキスト", result!.Text);
    }

    [Fact]
    public async Task UpdateAsync_TrimsWhitespaceFromText()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "  更新後  " });

        Assert.Equal("更新後", result!.Text);
    }

    // --- DeleteAsync ---

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenTodoNotFound()
    {
        Guid id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(false);

        bool result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenTodoDeleted()
    {
        Guid id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

        bool result = await _sut.DeleteAsync(id);

        Assert.True(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    // --- DeleteCompletedAsync ---

    [Fact]
    public async Task DeleteCompletedAsync_CallsRepositoryDeleteCompleted()
    {
        _repositoryMock.Setup(r => r.DeleteCompletedAsync()).Returns(Task.CompletedTask);

        await _sut.DeleteCompletedAsync();

        _repositoryMock.Verify(r => r.DeleteCompletedAsync(), Times.Once);
    }
}
