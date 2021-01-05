# Modular Bot

A modular Discord bot, built around the concept of Dependency Injection

## Why?

Dependency injection is a great development technique, and since so many aspiring programmers are making Discord bots, I wanted to expose them to this interesting world.

## How do I use it?

That's ... gonna take a long time to explain for now. 

You should know four things:
- Services are located here:
  - src/lib/service/discord-service.js: the discord client handler
  - src/lib/service/command-service.js: the command handler
  - src/lib/service/test-command-service.js: some testing for the command handler
- Utilities are located here:
  - src/util/command.js: The command class, used for creating commands
  - src/util/context.js: The command context class, used for callback shortcuts and argument validation
  - src/util/string: The library used to traverse a string
- Dependencies are all managed in the src/container.js file, and the index.js file contains the code related to startup and resolving dependencies
- This entire project can be `npm install`'d and used as a dependency itself, due to the usage of [Totally-DI](https://github.com/gear4s/totally-di)
