using Moq;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;

namespace TodoApp.Api.Tests.Services;

public class TodoServiceTests
{
    // CI確認用version2
    private readonly Mock<ITodoRepository> _repositoryMock = new();
    private readonly TodoService _sut;

    public TodoServiceTests()
    {
        _sut = new TodoService(_repositoryMock.Object);
    }

    // --- GetAllAsync ---

    [Fact]
    public async Task GetAllAsyncReturnsAllTodos()
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
    public async Task CreateAsyncCreatesAndReturnsTodo()
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
    public async Task CreateAsyncTrimsWhitespaceFromText()
    {
        CreateTodoRequest request = new CreateTodoRequest { Text = "  スペースあり  " };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);

        Assert.Equal("スペースあり", result.Text);
    }

    [Fact]
    public async Task CreateAsyncSetsCreatedAtToUtcNow()
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
    public async Task UpdateAsyncReturnsNullWhenTodoNotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>())).ReturnsAsync((Todo?)null);

        Todo? result = await _sut.UpdateAsync(Guid.NewGuid(), new UpdateTodoRequest { Text = "更新" });

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsyncUpdatesTextWhenTextProvided()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "更新後" });

        Assert.Equal("更新後", result!.Text);
    }

    [Fact]
    public async Task UpdateAsyncUpdatesCompletedWhenCompletedProvided()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.True(result!.Completed);
    }

    [Fact]
    public async Task UpdateAsyncDoesNotChangeTextWhenTextIsNull()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.Equal("元のテキスト", result!.Text);
    }

    [Fact]
    public async Task UpdateAsyncTrimsWhitespaceFromText()
    {
        Todo todo = new Todo { Id = Guid.NewGuid(), Text = "元", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "  更新後  " });

        Assert.Equal("更新後", result!.Text);
    }

    // --- DeleteAsync ---

    [Fact]
    public async Task DeleteAsyncReturnsFalseWhenTodoNotFound()
    {
        Guid id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(false);

        bool result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsyncReturnsTrueWhenTodoDeleted()
    {
        Guid id = Guid.NewGuid();
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

        bool result = await _sut.DeleteAsync(id);

        Assert.True(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    // --- DeleteCompletedAsync ---

    [Fact]
    public async Task DeleteCompletedAsyncCallsRepositoryDeleteCompleted()
    {
        _repositoryMock.Setup(r => r.DeleteCompletedAsync()).Returns(Task.CompletedTask);

        await _sut.DeleteCompletedAsync();

        _repositoryMock.Verify(r => r.DeleteCompletedAsync(), Times.Once);
    }
}
