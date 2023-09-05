# React

## React哲学

### 组件化

1. 程序设计——使用同样的技术决定你是否应该创建一个新的函数或者对象。这一技术即 单一功能原理，也就是说，一个组件理想得仅做一件事情。但随着功能的持续增长，它应该被分解为更小的子组件。
2. CSS——思考你将把类选择器用于何处。(然而，组件并没有那么细的粒度。)
3. 设计——思考你将如何组织布局的层级。

### 单向数据流

数据从树的顶层组件传递到下面的组件

### 响应式，state应该放在哪

### 反向数据流，事件，组件通信

## useState

1. Hooks ——以 use 开头的函数——只能在组件或自定义 Hook 的最顶层调用。 useState可以声明状态变量
2. 你只能在组件的顶层或自己的Hook中调用它。开发者模式严格模式下，会调用两次初始化函数以及setState，验证它是否为纯函数。
3. setState通过Object.is比较前后state是否相同来决定是否要进行更新，所以你不要修改一个对象或者数组而是应该替换它。或者使用Immer这个库来完成更新，Immer提供了useImmer的钩子。与之相对应的Vue的ref和reactive都支持对象修改的响应式。
4. React会批量更新，会在所有事件处理函数调用set函数后更新UI，如果你需要强制更新屏幕，可以用flushSync
5. 调用set不会立即修改state的值，而是在影响下一次渲染中useState返回的内容
6. set支持你传递的参数为一个函数或者一个真实的值
7. useState支持初始化函数，而不是一个默认值，这可以减少对资源的消耗
8. 所有的组件都可以通过key来重置状态。请记住 key 不是全局唯一的。它们只能指定 父组件内部 的顺序。

### 构建state的原则

1. 合并关联的 state。如果你总是同时更新两个或更多的 state 变量，请考虑将它们合并为一个单独的 state 变量。
2. 避免互相矛盾的 state。当 state 结构中存在多个相互矛盾或“不一致”的 state 时，你就可能为此会留下隐患。应尽量避免这种情况。
3. 避免冗余的 state。如果你能在渲染期间从组件的 props 或其现有的 state 变量中计算出一些信息，则不应将这些信息放入该组件的 state 中。
4. 避免重复的 state。当同一数据在多个 state 变量之间或在多个嵌套对象中重复时，这会很难保持它们同步。应尽可能减少重复。
5. 避免深度嵌套的 state。深度分层的 state 更新起来不是很方便。如果可能的话，最好以扁平化方式构建 state。

### 不推荐修改state的理由

1. 调试：如果你使用 console.log 并且不直接修改 state，你之前日志中的 state 的值就不会被新的 state 变化所影响。这样你就可以清楚地看到两次渲染之间 state 的值发生了什么变化
2. 优化：React 常见的 优化策略 依赖于如果之前的 props 或者 state 的值和下一次相同就跳过渲染。如果你从未直接修改 state ，那么你就可以很快看到 state 是否发生了变化。如果 prevObj === obj，那么你就可以肯定这个对象内部并没有发生改变。
3. 新功能：我们正在构建的 React 的新功能依赖于 state 被 像快照一样看待 的理念。如果你直接修改 state 的历史版本，可能会影响你使用这些新功能。
4. 需求变更：有些应用功能在不出现任何修改的情况下会更容易实现，比如实现撤销/恢复、展示修改历史，或是允许用户把表单重置成某个之前的值。这是因为你可以把 state 之前的拷贝保存到内存中，并适时对其进行再次使用。如果一开始就用了直接修改 state 的方式，那么后面要实现这样的功能就会变得非常困难。
5. 更简单的实现：React 并不依赖于 mutation ，所以你不需要对对象进行任何特殊操作。它不需要像很多“响应式”的解决方案一样去劫持对象的属性、总是用代理把对象包裹起来，或者在初始化时做其他工作。这也是为什么 React 允许你把任何对象存放在 state 中——不管对象有多大——而不会造成有任何额外的性能或正确性问题的原因。

### 实现原理

将每个hook的状态放到React的hooks数组中以缓存。如果没有创建则新建一个存入数组，如果已经创建则取出。setState时则更新状态值然后更新DOM。实际上React使用的链表来存储hooks状态

简单实现：

```js
let componentHooks = [];
let currentHookIndex = 0;

// useState 在 React 中是如何工作的（简化版）
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // 这不是第一次渲染
    // 所以 state pair 已经存在
    // 将其返回并为下一次 hook 的调用做准备
    currentHookIndex++;
    return pair;
  }

  // 这是我们第一次进行渲染
  // 所以新建一个 state pair 然后存储它
  pair = [initialState, setState];

  function setState(nextState) {
    // 当用户发起 state 的变更，
    // 把新的值放入 pair 中
    pair[0] = nextState;
    updateDOM();
  }

  // 存储这个 pair 用于将来的渲染
  // 并且为下一次 hook 的调用做准备
  componentHooks[currentHookIndex] = pair;
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // 每次调用 useState() 都会得到新的 pair
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);

  function handleNextClick() {
    setIndex(index + 1);
  }

  function handleMoreClick() {
    setShowMore(!showMore);
  }

  let sculpture = sculptureList[index];
  // 这个例子没有使用 React，所以
  // 返回一个对象而不是 JSX
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // 在渲染组件之前
  // 重置当前 Hook 的下标
  currentHookIndex = 0;
  let output = Gallery();

  // 更新 DOM 以匹配输出结果
  // 这部分工作由 React 为你完成
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}
```

用例

```js
let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// 使 UI 匹配当前 state
updateDOM();
```

## 响应事件

在 React 中所有事件都会冒泡，除了 onScroll，它仅适用于你附加到的 JSX 标签。可以通过`e.stopPropagation()`阻止事件冒泡。

如果你想使用捕获方式获取事件，则应该在方法名称后添加Capture来实现。

可以以属性的方式将处理函数传递下去，可以更好的追踪代码的执行。

阻止默认行为 `e.preventDefault()`

事件处理函数是处理副作用的最好位置

值得一提的是React的事件机制是采用了事件委托的机制（利用了浏览器冒泡机制），这样做的好处是，只需要在React根组件中监听事件，即可监听到所有元素的事件行为，从而大大减少了性能的消耗。而Vue没有这么做。

## 渲染

对于初次渲染，React会使用appendChild DOM API 将其创建的所有节点放在屏幕上。对于二次渲染，React将应用最少的必要操作，在渲染时计算，以使得DOM与最新的渲染输出相互匹配。

React 使用树形结构来对你创造的 UI 进行管理和建模。React 根据你的 JSX 生成 UI 树。React DOM 根据 UI 树去更新浏览器的 DOM 元素。

当你为一个组件添加 state 时，你可能会觉得 state “活”在组件内部。但实际上，state 被保存在 React 内部。根据组件在 UI 树中的位置，React 将它所持有的每个 state 与正确的组件关联起来。它是位于相同位置的相同组件，所以对 React 来说，它是同一个计数器。相同位置的不同组件会使 state 重置。当你在相同位置渲染不同的组件时，组件的整个子树都会被重置。

一般来说，如果你想在重新渲染时保留 state，几次渲染中的树形结构就应该相互“匹配”。结构不同就会导致 state 的销毁，因为 React 会在将一个组件从树中移除时销毁它的 state。

### 更新步骤

当你调用setState设置值会触发React的更新DOM

React在重新渲染一个组件时，依次执行以下：

1. 再次调用的你的函数（组件）
2. 你的函数会返回新的JSX快照
3. React会更新界面匹配你的快照

### flushSync

在 React 中，state 更新是排队进行的。通常，这就是你想要的。但是，在这个示例中会导致问题，因为 setTodos 不会立即更新 DOM。因此，当你将列表滚动到最后一个元素时，尚未添加待办事项。这就是为什么滚动总是“落后”一项的原因。

要解决此问题，你可以强制 React 同步更新（“刷新”）DOM。 为此，从 react-dom 导入 flushSync 并将 state 更新包裹 到 flushSync 调用中：

```js
flushSync(() => {
  setTodos([ ...todos, newTodo]);
});

listRef.current.lastChild.scrollIntoView();
```

这将指示 React 当封装在 flushSync 中的代码执行后，立即同步更新 DOM。因此，当你尝试滚动到最后一个待办事项时，它已经在 DOM 中了：

### 为什么不要嵌套定义组件函数

你在相同位置渲染的是 不同 的组件，所以 React 将其下所有的 state 都重置了。这样会导致 bug 以及性能问题。为了避免这个问题， 永远要将组件定义在最上层并且不要把它们的定义嵌套起来。

```jsx
import { useState } from 'react';

export default function MyComponent() {
  const [counter, setCounter] = useState(0);

  function MyTextField() {
    const [text, setText] = useState('');

    return (
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
    );
  }

  return (
    <>
      <MyTextField />
      <button onClick={() => {
        setCounter(counter + 1)
      }}>点击了 {counter} 次</button>
    </>
  );
}

```

## 组件间共享状态

状态提升，一般是将子组件的状态放到父组件

## reducer

随着组件复杂度的增加，你将很难一眼看清所有的组件状态更新逻辑。这个组件的每个事件处理程序都通过 setTasks 来更新状态。随着这个组件的不断迭代，其状态逻辑也会越来越多。为了降低这种复杂度，并让所有逻辑都可以存放在一个易于理解的地方，你可以将这些状态逻辑移到组件之外的一个称为 reducer 的函数中。

1. 把 useState 转化为 useReducer

    1. 通过事件处理函数 dispatch actions；
    2. 编写一个 reducer 函数，它接受传入的 state 和一个 action，并返回一个新的 state；
    3. 使用 useReducer 替换 useState；
  
2. Reducers 可能需要你写更多的代码，但是这有利于代码的调试和测试。
3. Reducers 必须是纯净的。
4. 每个 action 都描述了一个单一的用户交互。
5. 使用 Immer 来帮助你在 reducer 里直接修改状态。

### 优势劣势

1. 体积： 通常，在使用 useState 时，一开始只需要编写少量代码。而 useReducer 必须提前编写 reducer 函数和需要调度的 actions。但是，当多个事件处理程序以相似的方式修改 state 时，useReducer 可以减少代码量。
2. 可读性： 当状态更新逻辑足够简单时，useState 的可读性还行。但是，一旦逻辑变得复杂起来，它们会使组件变得臃肿且难以阅读。在这种情况下，useReducer 允许你将状态更新逻辑与事件处理程序分离开来。
3. 可调试性： 当使用 useState 出现问题时, 你很难发现具体原因以及为什么。 而使用 useReducer 时， 你可以在 reducer 函数中通过打印日志的方式来观察每个状态的更新，以及为什么要更新（来自哪个 action）。 如果所有 action 都没问题，你就知道问题出在了 reducer 本身的逻辑中。 然而，与使用 useState 相比，你必须单步执行更多的代码。
4. 可测试性： reducer 是一个不依赖于组件的纯函数。这就意味着你可以单独对它进行测试。一般来说，我们最好是在真实环境中测试组件，但对于复杂的状态更新逻辑，针对特定的初始状态和 action，断言 reducer 返回的特定状态会很有帮助。
5. 个人偏好： 并不是所有人都喜欢用 reducer，没关系，这是个人偏好问题。你可以随时在 useState 和 useReducer 之间切换，它们能做的事情是一样的！

### useReducer

useReducer 钩子接受 2 个参数：

一个 reducer 函数  
一个初始的 state  

它返回如下内容：

一个有状态的值  
一个 dispatch 函数（用来 “派发” 用户操作给 reducer）  

```js
const [tasks, dispatch] = useReducer(tasksReducer, initialTasks);
```

```js
export default function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map((t) => {
        if (t.id === action.task.id) {
          return action.task;
        } else {
          return t;
        }
      });
    }
    case 'deleted': {
      return tasks.filter((t) => t.id !== action.id);
    }
    default: {
      throw Error('未知 action：' + action.type);
    }
  }
}
```

### useImmerReducer

Reducers 应该是纯净的，所以它们不应该去修改 state。而 Immer 为你提供了一种特殊的 draft 对象，你可以通过它安全的修改 state。在底层，Immer 会基于当前 state 创建一个副本。这就是为什么通过 useImmerReducer 来管理 reducers 时，可以修改第一个参数，且不需要返回一个新的 state 的原因。

## Context

类似于vue中provide的机制

实现组件值传值

“如果在 `<Section>` 组件中的任何子组件请求 LevelContext，给他们这个 level。”组件会使用 UI 树中在它上层最近的那个 `<LevelContext.Provider>` 传递过来的值。

```js
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

```js
export default function Heading({ children }) {
  const level = useContext(LevelContext);
  // ...
}
```

```jsx
import { LevelContext } from './LevelContext.js';

export default function Section({ level, children }) {
  return (
    <section className="section">
      <LevelContext.Provider value={level}>
        {children}
      </LevelContext.Provider>
    </section>
  );
}
```

1. 你将一个 level 参数传递给 `<Section>`。
2. Section 把它的子元素包在 `<LevelContext.Provider value={level}>` 里面。
3. Heading 使用 `useContext(LevelContext)` 访问上层最近的 LevelContext 提供的值。

::: warning

1. 从 传递 props 开始。 如果你的组件看起来不起眼，那么通过十几个组件向下传递一堆 props 并不罕见。这有点像是在埋头苦干，但是这样做可以让哪些组件用了哪些数据变得十分清晰！维护你代码的人会很高兴你用 props 让数据流变得更加清晰。
2. 抽象组件并 将 JSX 作为 children 传递 给它们。 如果你通过很多层不使用该数据的中间组件（并且只会向下传递）来传递数据，这通常意味着你在此过程中忘记了抽象组件。举个例子，你可能想传递一些像 posts 的数据 props 到不会直接使用这个参数的组件，类似 `<Layout posts={posts} />`。取而代之的是，让 Layout 把 children 当做一个参数，然后渲染 `<Layout><Posts posts={posts} /></Layout>`。这样就减少了定义数据的组件和使用数据的组件之间的层级。

:::

### 使用场景

1. 主题
2. 当前账户
3. 路由
4. 状态管理

### Reducer和Context混合

随着应用的复杂性上升，context 和 reducer 的组合。这是一种强大的拓展应用并 提升状态 的方式，让你在组件树深处访问数据时无需进行太多工作。可以使用自定义的hook来获取数据和dispatch

### createContext

能让你创建一个 context 以便组件能够提供和读取。

## useRef

使用引用值，与useState不同，修改ref不会重新渲染。ref的格式为`{current: number}`。

|ref|state|
|---|---|
|useRef(initialValue)返回 { current: initialValue }|useState(initialValue) 返回 state 变量的当前值和一个 state 设置函数 ( [value, setValue])|
|更改时不会触发重新渲染 |更改时触发重新渲染。|
|可变 —— 你可以在渲染过程之外修改和更新 current 的值。|“不可变” —— 你必须使用 state 设置函数来修改 state 变量，从而排队重新渲染。|
|你不应在渲染期间读取（或写入） current 值。 |你可以随时读取 state。但是，每次渲染都有自己不变的 state 快照。|

你可以认为`useRef`是这样实现的

```js
// React 内部
function useRef(initialValue) {
  const [ref, unused] = useState({ current: initialValue });
  return ref;
}
```

### 使用场景

1. 存储 timeout ID
2. 存储和操作 DOM 元素，我们将在 下一页 中介绍
3. 存储不需要被用来计算 JSX 的其他对象。

### useImperativeHandle

```jsx
import {
  forwardRef, 
  useRef, 
  useImperativeHandle
} from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    // 只暴露 focus，没有别的
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}

```

useImperativeHandle 指示 React 将你自己指定的对象作为父组件的 ref 值。 所以 Form 组件内的 inputRef.current 将只有 focus 方法。在这种情况下，ref “句柄”不是 DOM 节点，而是你在 useImperativeHandle 调用中创建的自定义对象。

### React何时添加refs

1. 在 渲染 阶段， React 调用你的组件来确定屏幕上应该显示什么。
2. 在 提交 阶段， React 把变更应用于 DOM。

通常，你将从事件处理器访问 refs。 如果你想使用 ref 执行某些操作，但没有特定的事件可以执行此操作，你可能需要一个 effect。我们将在下一页讨论 effect。

### 使用 refs 操作 DOM 的最佳实践

如果你坚持聚焦和滚动等非破坏性操作，应该不会遇到任何问题。

避免更改由 React 管理的 DOM 节点。 对 React 管理的元素进行修改、添加子元素、从中删除子元素会导致不一致的视觉结果，或与上述类似的崩溃。

## useEffect

有些组件需要与外部系统同步。例如，你可能希望根据 React state 控制非 React 组件、设置服务器连接或在组件出现在屏幕上时发送分析日志。Effects 会在渲染后运行一些代码，以便可以将组件与 React 之外的某些系统同步。

类似于Vue的生命周期

::: warning
不要随意在你的组件中使用 Effect。记住，Effect 通常用于暂时“跳出” React 代码并与一些 外部 系统进行同步。这包括浏览器 API、第三方小部件，以及网络等等。如果你想用 Effect 仅根据其他状态调整某些状态，那么 你可能不需要 Effect。
:::

### 编写规则

1. 编写 Effect
2. 声明 Effect。默认情况下，Effect 会在每次渲染后都会执行。指定 Effect 依赖。大多数 Effect 应该按需执行，而不是在每次渲染后都执行。例如，淡入动画应该只在组件出现时触发。连接和断开服务器的操作只应在组件出现和消失时，或者切换聊天室时执行。
3. 必要时添加清理（cleanup）函数。有时 Effect 需要指定如何停止、撤销，或者清除它的效果。例如，“连接”操作需要“断连”，“订阅”需要“退订”，“获取”既需要“取消”也需要“忽略”。

### 生命周期

```js
function MyComponent() {
  useEffect(() => {
    // onMounted这里的代码只会在组件挂载后执行
    return () => {
      // clean 清理函数
      // 只在挂载时执行的useEffect中的回调函数可以理解为 unmounted
      // 每次重新执行 Effect 之前，React 都会调用清理函数；组件被卸载时，也会调用清理函数。
    }
  }, []);
  useEffect(() => {
    // onUpdated每次渲染后都会执行此处的代码
    return () => {
      // clean 清理函数
    }
  });
  return <div />;
}
```

### 副作用包裹

使用 useEffect 包裹副作用，把它分离到渲染逻辑的计算过程之外：

```js
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const ref = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      ref.current.play();
    } else {
      ref.current.pause();
    }
  }, [isPlaying]);

  return <video ref={ref} src={src} loop playsInline />;
}
```

### useEffect指定依赖

如果 isPlaying 在上一次渲染时与当前相同，它应该跳过重新运行 Effect

```js
useEffect(() => {}, [isPlaying])
```

::: info

ref可以不指定在依赖中

这是因为 ref 具有 稳定 的标识：React 保证 每轮渲染中调用 useRef 所产生的引用对象时，获取到的对象引用总是相同的，即获取到的对象引用永远不会改变，所以它不会导致重新运行 Effect。因此，依赖数组中是否包含它并不重要

:::

::: warning

1. Effect 不能在服务端执行。这意味着服务器最初传递的 HTML 不会包含任何数据。客户端的浏览器必须下载所有 JavaScript 脚本来渲染应用程序，然后才能加载数据——这并不搞笑。
2. 直接在 Effect 中获取数据容易产生网络瀑布（network waterfall）。首先渲染了父组件，它会获取一些数据并进行渲染；然后渲染子组件，接着子组件开始获取它们的数据。如果网络速度不够快，这种方式比同时获取所有数据要慢得多。
3. 直接在 Effect 中获取数据通常意味着无法预加载或缓存数据。例如，在组件卸载后然后再次挂载，那么它必须再次获取数据。
4. 这不是很符合人机交互原则。如果你不想出现像 条件竞争（race condition） 之类的问题，那么你需要编写更多的样板代码。

开发环境下，Effect 会执行两次

:::

### 总结

1. 与事件不同，Effect 是由渲染本身，而非特定交互引起的。
2. Effect 允许你将组件与某些外部系统（第三方 API、网络等）同步。
3. 默认情况下，Effect 在每次渲染（包括初始渲染）后运行。
4. 如果 React 的所有依赖项都与上次渲染时的值相同，则将跳过本次 Effect。
5. 不能随意选择依赖项，它们是由 Effect 内部的代码决定的。
6. 空的依赖数组（[]）对应于组件“挂载”，即添加到屏幕上。
7. 仅在严格模式下的开发环境中，React 会挂载两次组件，以对 Effect 进行压力测试。
8. 如果 Effect 因为重新挂载而中断，那么需要实现一个清理函数。
9. React 将在下次 Effect 运行之前以及卸载期间这两个时候调用清理函数。
10. 如果你可以在渲染期间计算某些内容，则不需要使用 Effect。
11. 想要缓存昂贵的计算，请使用 useMemo 而不是 useEffect。
12. 想要重置整个组件树的 state，请传入不同的 key。
13. 想要在 prop 变化时重置某些特定的 state，请在渲染期间处理。
14. 组件 显示 时就需要执行的代码应该放在 Effect 中，否则应该放在事件处理函数中。
15. 如果你需要更新多个组件的 state，最好在单个事件处理函数中处理。
16. 当你尝试在不同组件中同步 state 变量时，请考虑状态提升。
17. 你可以使用 Effect 获取数据，但你需要实现清除逻辑以避免竞态条件。

## useMemo

缓存记忆，除非 依赖项发生变化否则不会重复执行

```js
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => {
    // ✅ 除非 todos 或 filter 发生变化，否则不会重新执行
    return getFilteredTodos(todos, filter);
  }, [todos, filter]);
  // ...
}
```

## useSyncExternalStore

订阅 React state 之外的一些数据。这些数据可能来自第三方库或内置浏览器 API。

监听网络状态的变化

```js
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ 非常好：用内置的 Hook 订阅外部 store
  return useSyncExternalStore(
    subscribe, // 只要传递的是同一个函数，React 不会重新订阅
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

## useEffectEvent

1. 事件处理函数在响应特定交互时运行。
2. Effect 在需要同步的时候运行。
3. 事件处理函数内部的逻辑是非响应式的。
4. Effect 内部的逻辑是响应式的。
5. 你可以将非响应式逻辑从 Effect 移到 Effect Event 中。
6. 只在 Effect 内部调用 Effect Event。
7. 不要将 Effect Event 传给其他组件或者 Hook。

```js
function Timer() {
  const [count, setCount] = useState(0);
  useTimer(() => {
    setCount(count + 1);
  }, 1000);
  return <h1>{count}</h1>
}

function useTimer(callback, delay) {
  const onTick = useEffectEvent(() => {
    callback();
  });

  useEffect(() => {
    const id = setInterval(() => {
      onTick(); // ✅ Good: 只在 Effect 内部局部调用
    }, delay);
    return () => {
      clearInterval(id);
    };
  }, [delay]); // 不需要指定 “onTick” (Effect Event) 作为依赖项
}
```

## 自定义Hook

每当组件重新渲染，自定义 Hook 中的代码就会重新运行。这就是组件和自定义 Hook 都 需要是纯函数 的原因。我们应该把自定义 Hook 的代码看作组件主体的一部分。

每当你写 Effect 时，考虑一下把它包裹在自定义 Hook 是否更清晰。你不应该经常使用 Effect，所以如果你正在写 Effect 就意味着你需要“走出 React”和某些外部系统同步，或者需要做一些 React 中没有对应内置 API 的事。把 Effect 包裹进自定义 Hook 可以准确表达你的目标以及数据在里面是如何流动的。

提取自定义 Hook 让数据流清晰。输入 url，就会输出 data。通过把 Effect “隐藏”在 useData 内部，你也可以防止一些正在处理 ShippingForm 组件的人向里面添加 不必要的依赖。随着时间的推移，应用中大部分 Effect 都会存在于自定义 Hook 内部。

1. 自定义 Hook 让你可以在组件间共享逻辑。
2. 自定义 Hook 命名必须以后跟一个大写字母的 use 开头。
3. 自定义 Hook 共享的只是状态逻辑，不是状态本身。
4. 你可以将响应值从一个 Hook 传到另一个，并且他们会保持最新。
5. 每次组件重新渲染时，所有的 Hook 会重新运行。
6. 自定义 Hook 的代码应该和组件代码一样保持纯粹。
7. 把自定义 Hook 收到的事件处理函数包裹到 Effect Event。
8. 不要创建像 useMount 这样的自定义 Hook。保持目标具体化。
9. 如何以及在哪里选择代码边界取决于你。

## useTransition

useTransition 是一个让你在不阻塞 UI 的情况下来更新状态的 React Hook。

1. 将状态更新标记为非阻塞转换状态
2. 在转换中更新父组件
3. 在转换期间显示待处理的视觉状态
4. 避免不必要的加载指示器
5. 构建一个Suspense-enabled 的路由

### 使用 useTransition

在组件的顶层调用 useTransition，将某些状态更新标记为转换状态。

```js
import { useTransition } from 'react';

function TabContainer() {
  const [isPending, startTransition] = useTransition();
  // ...
}
```

useTransition 返回一个由两个元素组成的数组：

isPending 标志，告诉你是否存在待处理的转换。  
startTransition 函数 允许你将状态更新标记为转换状态。  

作用域（scope）：一个通过调用一个或多个 set 函数。 函数更新某些状态的函数。React 会立即不带参数地调用此函数，并将在作用域函数调用期间计划同步执行的所有状态更新标记为转换状态。它们将是非阻塞的，并且 不会显示不想要的加载指示器。

::: warning

1. useTransition 是一个 Hook，因此只能在组件或自定义 Hook 内部调用。如果你需要在其他地方启动转换（例如从数据库），请调用独立的 startTransition 函数。
2. 只有在你可以访问该状态的 set 函数时，才能将更新包装为转换状态。如果你想响应某个 prop 或自定义 Hook 值启动转换，请尝试使用 useDeferredValue。
3. 你传递给 startTransition 的函数必须是同步的。React 立即执行此函数，标记其执行期间发生的所有状态更新为转换状态。如果你稍后尝试执行更多的状态更新（例如在一个定时器中），它们将不会被标记为转换状态。
4. 标记为转换状态的状态更新将被其他状态更新打断。例如，如果你在转换状态中更新图表组件，但在图表正在重新渲染时开始在输入框中输入，React 将在处理输入更新后重新启动对图表组件的渲染工作。
5. 转换状态更新不能用于控制文本输入。
6. 如果有多个正在进行的转换状态，React 目前会将它们批处理在一起。这是一个限制，可能会在未来的版本中被删除。

:::

```js
function selectTab(nextTab) {
  startTransition(() => {
    setTab(nextTab);      
  });
}
```

## 其他API

### Fragment

### Profiler

1. 编程式测量渲染性能
2. 测量应用的不同部分

```js
<Profiler id="App" onRender={onRender}>
  <App />
</Profiler>
```

### StrictMode

1. 为整个应用启用严格模式
2. 为应用的一部分启用严格模式
3. 修复在开发过程中通过双重渲染发现的错误
4. 修复在开发中通过重新运行 Effect 发现的错误
5. 修复严格模式发出的弃用警告

`<StrictMode>` 帮助你在开发过程中尽早地发现组件中的常见错误。

```jsx
<StrictMode>
  <App />
</StrictMode>
```

### Suspense

`<Suspense>` 允许你显示一个退路方案（fallback）直到它的子组件完成加载。

```js
<Suspense fallback={<Loading />}>
  <SomeComponent />
</Suspense>
```

1. 当内容正在加载时显示退路方案（fallback）
2. 同时展示内容
3. 逐步加载内容
4. 在新内容加载时展示过时内容
5. 阻止已经显示的内容隐藏
6. 表明过渡正在发生
7. 在导航时重置 Suspense 边界
8. 为服务器错误和客户端内容提供退路方案（fallback）

### useDebugValue

1. 为自定义 Hook 添加标签, 在 自定义 Hook 中调用 useDebugValue，可以让 React 开发工具 显示可读的 调试值。

    ```js
    import { useDebugValue } from 'react';

    function useOnlineStatus() {
      // ...
      useDebugValue(isOnline ? 'Online' : 'Offline');
      // ...
    }
    ```

2. 延迟格式化调试值

  ```js
    useDebugValue(date, date => date.toDateString());
  ```

### useDeferredValue

延迟更新 UI 的某些部分。

1. 在新内容加载期间显示旧内容。
2. 表明内容已过时
3. 延迟渲染 UI 的某些部分

```js
import { useState, useDeferredValue } from 'react';
import SlowList from './SlowList.js';

export default function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);
  return (
    <>
      <input value={text} onChange={e => setText(e.target.value)} />
      <SlowList text={deferredText} />
    </>
  );
}
```

### useId

1. 为无障碍属性生成唯一 ID
2. 为多个相关元素生成 ID
3. 为所有生成的 ID 指定共享前缀

### useImperativeHandle

类似于vue的 defineExpose

1. 向父组件暴露一个自定义的 ref 句柄
2. 暴露你自己的命令式方法

```js
import { forwardRef, useImperativeHandle } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  useImperativeHandle(ref, () => {
    return {
      // ... 你的方法 ...
    };
  }, []);
  // ...
})
```

### useInsertionEffect

可以在布局副作用触发之前将元素插入到 DOM 中。

useInsertionEffect 是为 CSS-in-JS 库的作者特意打造的。除非你正在使用 CSS-in-JS 库并且需要注入样式，否则你应该使用 useEffect 或者 useLayoutEffect。

### useLayoutEffect

useLayoutEffect 是 useEffect 的一个版本，在浏览器重新绘制屏幕之前触发。useLayoutEffect 可能会影响性能。尽可能使用 useEffect。

```js
import { useState, useRef, useLayoutEffect } from 'react';

function Tooltip() {
  const ref = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  useLayoutEffect(() => {
    const { height } = ref.current.getBoundingClientRect();
    setTooltipHeight(height);
  }, []);
  // ...
```

### forwardRef

允许你的组件使用 ref 将一个 DOM 节点暴露给父组件。

1. 将 DOM 节点暴露给父组件
2. 在多个组件中转发 ref
3. 暴露一个命令式句柄而不是 DOM 节点

```jsx
import { forwardRef } from 'react';

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});

```

render：组件的渲染函数。React 会调用该函数并传入父组件传递来的参数和 ref。返回的 JSX 将成为组件的输出。

### lazy

lazy 能够让你在组件第一次被渲染之前延迟加载组件的代码。

对标Vue defineAsyncComponent

```js
import { lazy } from 'react';

const SomeComponent = lazy(load)

const MarkdownPreview = lazy(() => import('./MarkdownPreview.js'));

const AsyncMarkdownPreview = () => {
  <Suspense fallback={<Loading />}>
    <h2>Preview</h2>
    <MarkdownPreview />
  </Suspense>
}
```

### memo

memo 允许你的组件在 props 没有改变的情况下跳过重新渲染。

```js
const MemoizedComponent = memo(SomeComponent, arePropsEqual?)
```

1. 当 props 没有改变时跳过重新渲染
2. 使用 state 更新记忆化（memoized）组件
3. 使用 context 更新记忆化（memoized）组件
4. 最小化 props 的变化
5. 指定自定义比较函数
6. 记忆化只与从父组件传递给组件的 props 有关。

Component：要进行记忆化的组件。memo 不会修改该组件，而是返回一个新的、记忆化的组件。它接受任何有效的 React 组件，包括函数组件和 forwardRef 组件。

可选参数 arePropsEqual：一个函数，接受两个参数：组件的前一个 props 和新的 props。如果旧的和新的 props 相等，即组件使用新的 props 渲染的输出和表现与旧的 props 完全相同，则它应该返回 true。否则返回 false。通常情况下，你不需要指定此函数。默认情况下，React 将使用 Object.is 比较每个 prop。

### startTransition

startTransition 可以让你在不阻塞 UI 的情况下更新 state。

```jsx
import { startTransition } from 'react';

function TabContainer() {
  const [tab, setTab] = useState('about');

  function selectTab(nextTab) {
    startTransition(() => {
      setTab(nextTab);
    });
  }
  // ...
}
```

::: warning

1. startTransition 没有提供一种跟踪 transition 是否处于待定状态的方法。为了在 transition 进行时显示一个待定状态的指示器，你需要使用 useTransition。
2. 只有当你能访问某个 state 的 set 函数时，你才能将它的更新包裹到 transition 中。如果你想根据 props 或自定义 Hook 的返回值来启动一个 transition，请尝试使用 useDeferredValue。
3. 你传递给 startTransition 的函数必须是同步的。React 会立即执行此函数，将其执行期间发生的所有 state 更新标记为 transition。如果你想试着稍后执行更多的 state 更新（例如，在 timeout 中），它们不会被标记为转换。
4. 一个被标记为 transition 的 state 更新时将会被其他 state 更新打断。例如，如果你在 transition 内部更新图表组件，但在图表重新渲染时在输入框中打字，则 React 将先处理输入 state 更新，之后才会重新启动对图表组件的渲染工作。
5. transition 更新不能用于控制文本输入。
6. 如果有多个正在进行的 transition，当前 React 会将它们集中在一起处理。这是一个限制，在未来的版本中可能会被移除。

:::

### createPortal

类似于Vue teleport

### createRoot

createRoot 允许在浏览器的 DOM 节点中创建根节点以显示 React 组件。

```js
const root = createRoot(domNode, options?)
```

### hydrateRoot

hydrateRoot 函数允许你在先前由 react-dom/server 生成的浏览器 HTML DOM 节点中展示 React 组件。

```js
const root = hydrateRoot(domNode, reactNode, options?)
```

## Vue和React的区别（作业帮）

## React为什么需要Fiber，是为了解决什么问题的（作业帮）

当React更新一个节点时，其下属的所有的节点也要一起patch，哪怕最终这些子节点可能只有几个发生了改变，但是diff是少不了的，这也就意味当一次patch的节点数量足够多时，因为JS的单线程，且执行js和渲染时互斥交替进行的，就会阻塞浏览器渲染线程，给用户以明显卡顿的感觉。所以React引入了Fiber，在我的了解中，React是将虚拟DOM树拍平成一个链表，然后通过空闲时间帧进行diff比较，将长任务变成多个短任务
