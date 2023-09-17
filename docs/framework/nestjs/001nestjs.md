# IOC 解决了哪些痛点

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
