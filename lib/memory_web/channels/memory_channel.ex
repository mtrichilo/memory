defmodule MemoryWeb.MemoryChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("game:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.Backup.load(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => game}, socket}
    else
      {:error, %{"reason" => "unauthorized"}}
    end
  end

  def handle_in("click", %{"index" => index}, socket) do
    game = Game.select(socket.assigns.game, index)
    socket = assign(socket, :game, game)
    Memory.Backup.save(socket.assigns.name, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("flip", %{}, socket) do
    game = Game.flip(socket.assigns.game)
    socket = assign(socket, :game, game)
    Memory.Backup.save(socket.assigns.name, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def handle_in("restart", %{}, socket) do
    game = Game.new()
    socket = assign(socket, :game, game)
    Memory.Backup.save(socket.assigns.name, game)
    {:reply, {:ok, %{"game" => game}}, socket}
  end

  def authorized?(_payload) do
    true
  end
end
