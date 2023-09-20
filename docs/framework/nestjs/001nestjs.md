# NestJS

## IOC 解决了哪些痛点

后端系统中会有很多对象

1. Controller对象：接收http请求，调用Service，返回响应
2. Service对象：实现业务逻辑
3. Repository对象：实现对数据库的增删改查

此外还有数据库链接对象 DataSource, 配置对象Config等等

Controller依赖Service实现业务逻辑，Service依赖Repository来做增删改查  
Repository依赖DataSource来建立连接，DataSource又需要从Config对象拿到用户名密码等信息  

这就导致创建这些对象很复杂，要先理清他们之间的关系，先后顺序，经过一系列初始化后才能用Controller对象。这些对象不需要每次都new一个新的，一直用一个就可以，也就是保持单例。

应用初始化时，需要先理清依赖先后关系，创建一堆对象组合起来，还要保证不要多次new，这个就是后端系统都有的痛点。解决这个痛点的方式就是IOC（Inverse Of Control）控制反转。

java的Spring就实现了IOC，Nest也同样实现了。

手动创建和组装对象很麻烦，我可以先在class上声明依赖，然后让工具帮我分析声明的依赖关系，根据先后顺序自动把对象创建好，组装起来这就是IOC的思路。

它有一个放对象的容器，程序初始化的时候会扫描class上声明的依赖关系，然后把这些class都给new一个实例放到容器里。创建对象的时候，还会把它们依赖的对象注入进去。这样就完成了对象的自动创建和组装。这种依赖注入的方式叫做 Dependency Injection，简称DI

这种方案叫做IOC就是因为本来手动new依赖对象组装，现在是声明好了依赖，等着被注入。

在class上声明依赖的方式，大家都选择了装饰器的方式

AppService里声明了@Injectable代表这个class可注入，那么nest对象就会把它放到IOC容器里

AppController声明@Controller代表这个class可以被注入，nest也会把它放到IOC容器里，但因为Controller只需要被注入，不需要注入到别的对象，所以使用了一个单独的装饰器

然后在AppModule里引入，通过@Module声明模块，其中controller是控制器，只能被注入。

providers里可以被注入，也可以注入别的对象，比如这里的AppService。然后在入口模块里跑起来。

所以 AppController 只是声明了对 AppService 的依赖，就可以调用它的方法了：

nest 在背后自动做了对象创建和依赖注入的工作。

nest 还加了模块机制，可以把不同业务的 controller、service 等放到不同模块里。

当 import 别的模块后，那个模块 exports 的 provider 就可以在当前模块注入了。

比如 OtherModule 里有 XxxService、YyyService 这两个 provider，导出了 XxxService。

## 多种provider

1. 直接使用类名，写起来最简洁，最常用的。useClass 的方式由 IOC 容器负责实例化
2. `provide`使用字符串，`Inject`需要传参
3. 使用`useValue`可以传一个值
4. 使用`useFactory`可以异步函数，可以传参,可以用来动态创建数据库连接对象
5. 使用`useExisting`可以指定别名

```ts
@Module({
    providers: [
        AppService,
        {
            provide: 'app_service',
            useClass: AppService,
        },
        {
            provide: 'person',
            useValue: {
                name: 'aaa',
                age: 20,
            }
        },
        {
            provide: 'person2',
            useFactory() {
                await new Promise((resolve) => setTimeout(resolve, 3000))
                return {
                    name: 'bbb',
                    desc: 'cccc'
                }
            }
        },
        {
            // 指定别名
            provide: 'person3',
            useExisting: 'person2'
        }
    ]
})
```

一般情况下，provider 是通过 @Injectable 声明，然后在 @Module 的 providers 数组里注册的 class。

## 生命周期

先调用每个模块的controller、provider的onModuleDestroy方法，然后调用Module的onModuleDestroy方法

1. bootstrapping starts
2. *onModuleInit*
3. *onApplicationBootstrap*
4. Start listeners
5. Application is running
6. *onModuleDestroy*
7. *beforeApplicationShutdown*
8. Stop listeners
9. *onApplicationShutdown*
10. Process exists

beforeApplicationShutdown和OnModuleDestroy有一个区别

beforeApplicationShutdown是可以拿到signal系统信号的，比如SIGTERM，这些终止信号是别的进程传过来的，让它做一些销毁的事情，比如用k8s管理容器的时候，可以通过这个信号来通知它

生命周期都支持异步函数，生命周期中可以通过moduleRef取出一些provider来销毁，比如关闭连接。这里的moduleRef就是当前模块的对象。

```ts
class {
    async onApplicationShutdown() {
        const connection = this.moduleRef.get<any>(this.connectionName)
        connection && (await connection.close())
    }
}

```

## MVC

后端基本上都是MVC架构，通过

C:Controller  
M:Service + Repository  
V:View  

## AOP

Nest提供了AOP（Aspect Oriented Programming）的能力，也就是面向切面编程的能力

想要在  Controller、Service、Repository这个调用链路里加一些通用逻辑，比如日志记录、权限控制、异常处理等。

在Controller调用前和调用后，加入这段逻辑。

这样的横向扩展点就叫做切面，这种透明的加入一些切面逻辑的编程方式就叫做 AOP （面向切面编程）。

AOP 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的纯粹性，这样切面逻辑可以复用，还可以动态的增删。其实 Express 的中间件的洋葱模型也是一种 AOP 的实现，因为你可以透明的在外面包一层，加入一些逻辑，内层感知不到。而 Nest 实现 AOP 的方式更多，一共有五种，包括 Middleware、Guard、Pipe、Interceptor、ExceptionFilter

### Middleware

Nest的底层是Express，自然可以使用中间件，但是做了进一步细分，分为全局中间件和路由中间件

全局中间件就是Express的那种中间件，在请求之前和之后加入一些处理逻辑，每个请求都会走到这里

```ts
const app = await NestFactory.create(AppModule)
app.use(logger)
await app.listen(3000)
```

路由中间件则是针对某个路由来说的，范围更小一些

```ts
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(LoggerMiddleware)
            .forRoutes('cats')
    }
}
```

### Guard

路由守卫，可以用于在调用某个Controller前判断权限，返回true或者false来决定是否放行

```ts
@Injectable()
export class RolesGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        return true
    }
}
```

Guard 要实现 CanActivate 接口，实现canActivate方法，可以从context拿到请求信息，然后做一些权限验证登处理之后，返回true或者false

通过 @Injectable 装饰器加到IOC容器中，然后可以在某个Controller启用了

```ts
@Controller('cats')
@UseGuard(RolesGuard)
export class CatsController {}
```

Controller本身不需要做啥修改，却透明的加上了权限判断的逻辑，这就是AOP架构的好处

而且Guard也可以全局启用

```ts
const app = await NestFactory.create(AppModule)
app.useGlobalGuards(new RolesGuard())
```

Guard可以抽离路由的访问控制逻辑，但是不能对请求、响应做修改，这种逻辑可以使用Interceptor

### Interceptor

Interceptor是拦截器，可以在目标Controller方法前后加入一些逻辑

```ts
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...')
        const now = Date.now()
        return next
            .handle()
            .pipe(
                tap(() => console.log(`After... ${Date.now() - now}ms`))
            )
    }
}
```

Interceptor 要实现 NestInterceptor 接口，实现 intercept 方法，调用 next.handle() 就会调用目标 Controller，可以在之前和之后加入一些处理逻辑。

Controller 之前之后的处理逻辑可能是异步的。Nest 里通过 rxjs 来组织它们，所以可以使用 rxjs 的各种 operator。

Interceptor 支持每个路由单独启用，只作用于某个 controller，也同样支持全局启用，作用于全部 controller：

```ts
@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

```ts
const app = await NestFactory.create(ApplicationModule)
app.useGlobalInterceptors(new LoggingInterceptor())
```

除了路由的权限控制、目标Controller之前之后的处理这些都是通用逻辑外，对参数的处理也是一个通用的逻辑，所以Nest也抽出对应的切面，也就是Pipe

### Pipe

用于参数的检验和转换

```ts
export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        return value
    }
}
```

Pipe 要实现 PipeTransform 接口，实现 transform 方法，里面可以对传入的参数值 value 做参数验证，比如格式、类型是否正确，不正确就抛出异常。也可以做转换，返回转换后的值。

内置的有 9 个 Pipe：

1. ValidationPipe
2. ParseIntPipe
3. ParseBoolPipe
4. ParseArrayPipe
5. ParseUUIDPipe
6. DefaultValuePipe
7. ParseEnumPipe
8. ParseFloatPipe
9. ParseFilePipe

```ts
@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto)
}
```

```ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(3000)
}

bootstrap()
```

### ExceptionFilter

ExceptionFilter 可以对抛出的异常做处理，返回对应的响应

```ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        const status = exception.getStatus()

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url,
            })
    }
}
```

Nest 通过这样的方式实现了异常到响应的对应关系，代码里只要抛出不同的异常，就会返回对应的响应，很方便。

```ts
class AaaController {
    @Post()
    @UseFilters(new HttpExceptionFilter())
    async create(@Body() createCatDto: CreateCatDto) {
        throw new ForbiddenException()
    }
}
```

```ts
async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalFilters(new HttpExceptionFilter())
    await app.listen(3000)
}

bootstrap()
```

### 小结

进入路由的时候会先调用 Guard, 判断权限，如果没有权限，抛出异常。抛出ForbiddenException会被ExceptionFilter处理，返回403状态码。如果有权限，就会调用到拦截器，拦截器组织了一个链条，一个个的调用，最后会调用的controller的方法，调用controller方法之前会使用pipe对参数处理。

ExceptionFilter 的调用时机很容易想到，就是在响应之前对异常做一次处理。

而 Middleware 是 express 中的概念，Nest 只是继承了下，那个是在最外层被调用。

MVC 就是 Model、View Controller 的划分，请求先经过 Controller，然后调用 Model 层的 Service、Repository 完成业务逻辑，最后返回对应的 View。

IOC 是指 Nest 会自动扫描带有 @Controller、@Injectable 装饰器的类，创建它们的对象，并根据依赖关系自动注入它依赖的对象，免去了手动创建和组装对象的麻烦。

AOP 则是把通用逻辑抽离出来，通过切面的方式添加到某个地方，可以复用和动态增删切面逻辑。

Nest 的 Middleware、Guard、Interceptor、Pipe、ExceptionFilter 都是 AOP 思想的实现，只不过是不同位置的切面，它们都可以灵活的作用在某个路由或者全部路由，这就是 AOP 的优势。

Nest 就是通过这种 AOP 的架构方式，实现了松耦合、易于维护和扩展的架构。
