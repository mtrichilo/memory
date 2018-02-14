defmodule Memory.Backup do
  use Agent

  def start_link() do
     Agent.start_link(fn -> %{} end, name: __MODULE__)
  end

  def save(name, game) do
    Agent.update(__MODULE__, &(Map.put(&1, name, game)))
  end

  def load(name) do
    Agent.get(__MODULE__, &(Map.get(&1, name)))
  end
end
