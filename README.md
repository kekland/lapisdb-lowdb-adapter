# lapisdb-lowdb-adapter

A [*LowDB*](https://github.com/typicode/lowdb) adapter for [**LapisDB**](https://github.com/kekland/lapisdb).

## Installation

```bash
npm i --save lapisdb-lowdb-adapter
```

## Usage

```ts
import { LowDbAdapter } from 'lapisdb-lowdb-adapter'
import { MyModel } from './model'

const databaseName = 'test'
const directory = './database'

const adapter = new LowDbAdapter(MyModel, {name: databaseName, directory: directory})
await adapter.open() // <-- this is important

const datastore = new Datastore<Planet>('test', adapter)
```

For more information see [LapisDB documentation](https://github.com/kekland/lapisdb).

## 📧 Contact me

**E-Mail**: `kk.erzhan@gmail.com`
