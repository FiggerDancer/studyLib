# NestJS中的装饰器

## @Module 声明模块

## @Controller controller

指定Controller的生效路径

```ts
@Controller({ host: ':host.0.0.1', path: 'aaa'})
export class AaaController {}
```

这时候你会发现只有 host 满足 xx.0.0.1 的时候才会路由到这个 controller。

## @Injectable 注入

## @Optional 参数可选

## @Global 全局

## @Catch 捕获异常

## @UseFilters 过滤器抛错

## @UseGuards 守卫

## @UseInterceptors 拦截器

## @UsePipes pipe管道

## @Param

取 /xxx/111

```ts
class Controller {
    @Get('/xxx/:aaa')
    getHello2(@Param('aaa', ParseIntPipe) aaa: number, @Query('bbb', ParseBoolPipe) bbb: boolean) {
        console.log(typeof aaa, typeof bbb)
        console.log(aaa, bbb)
    }
}
```

## @Query

## @Post

## @Body 取到body部分

我们一般用dto的class来接受请求体里的参数

```ts
class AaaDto {
    a: number
    b: number
}
```

nest会实例化一个dto对象

```json
{
    "a": 1,
    "b": 2
}
```

## @Put

## @Delete

## @Patch

## @Options

## @Head

## @SetMetadata

handler和class可以通过@SetMetadata指定metadata，然后在guard或者interceptor中取出

## @Headers

可以通过它取某个请求头或者全部请求头

## @Ip

通过它获取请求的ip

```ts
@Get('/ip')
ip(@Ip() ip: string) {
    console.log(ip)
}
```

## @Session

通过它获取session对象

```ts
@Get('/session')
session(@Session() session) {
    if (!session.count) {
        session.count = 0 
    }
    session.count = session.count + 1
    return session.count
}
```

但要使用session需要安装一个express中间件，express-session

```ts
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import * as session from 'express-session'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    // 指定加密的密钥和cookie的存活时间
    app.use(session({
        secret: 'lxy123',
        cookie: {
            maxAge: 100000
        }
    }))
    await app.listen(3000)
}

bootstrap()
```

## HostParam

获取域名参数

```ts
import { Controller, Get, HostParam } from '@nestjs/common'

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello(@HostParam('host') host) {
        return host
    }
}
```

## @Req 或者 @Request

```ts
class AaaController {
    @Get('ccc') 
    ccc(@Req() req: Request) {
        console.log(req.hostname)
        console.log(req.url)
    }
}
```

## @Res 或 @Response

如果不返回响应，服务器会一直没有响应，可以自己返回响应

```ts
class AaaController {
    @Get('ddd') 
    ddd(@Res() res: Request) {
        // 如果不返回响应，服务器会一直没有响应
        // 你可以自己返回响应
        res.end('ddd')
    }
}
```

Nest这么设计是为了防止你的响应和Nest返回的响应冲突，通过passthrough参数告诉Nest，自己不会返回响应

```ts
class AaaController {
    @Get('ddd') 
    ddd(@Res({ passthrough: true }) res: Request) {
        return 'ddd'
    }
}
```

## @Next

当你有两个handler来处理同一个路由的时候，可以在第一个handler里注入next，调用它来请求转发到第二个handler

```ts
class AaaController {
    @Get('eee')
    eee(@Next() next: NextFunction) {
        console.log('handler1')
        next()
        return '111'
    }

    @Get('eee')
    eee2() {
        console.log('handler2')
        return 'eee'
    }
}
```

## @HttpCode

handler默认返回200状态码，该装饰器可修改

```ts
class AaaController {
    @Get('fff')
    @HttpCode(222)
    fff() {
        return 'hello'
    }
}   
```

## @Header

修改response header

```ts
@Get('ggg')
@Header('aaa', 'bbb')
ggg() {
    return 'hello'
}
```

## @Redirect装饰器重定向

```ts
@Get('hhh')
@Redirect('https://lxy951101.github.io/studyLib/')
hhh() {
    
}
```

## 指定渲染引擎

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```

## 合并装饰器

applyDecorators

```ts
import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { Aaa } from './aaa.decorator';
import { AaaGuard } from './aaa.guard';

export function Bbb(path, role) {
  return applyDecorators(
    Get(path),
    Aaa(role),
    UseGuards(AaaGuard)
  )
}
```

## 自定义装饰器

```ts
export const MyQuery = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
        const request: Request = ctx.switchToHttp().getRequest()
        return request.query[key]
    }
)
```

## Metadata和Reflector

1. Reflect.defineMetadata
2. Reflect.getMetadata

现在NestJS中是依赖了ts的emitDecoratorMetadata编译选项

## 创建循环依赖

可以通过forwardRef

```ts
import { forwardRef, Module } from '@nestjs/common'
import { BbbModule } from 'src/bbb/bbb.module'

@Module({
    imports: [
        forwardRef(() => BbbModule)
    ]
})
```

```ts
import { forwardRef, Module } from '@nestjs/common'
import { AaaModule } from 'src/aaa/aaa.module'

@Module({
    imports: [
        forwardRef(() => AaaModule)
    ]
})
```
