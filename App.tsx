import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Screen = 'Following' | 'Explore' | 'Create' | 'Saved' | 'Profile';
type MediaType = 'photo' | 'video';

type Comment = {
  id: string;
  author: string;
  avatar: string;
  text: string;
};

type Post = {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  image: string;
  mediaType: MediaType;
  category: string;
  title: string;
  caption: string;
  ingredients: string;
  instructions: string;
  nutrition: string;
  likes: number;
  comments: Comment[];
  liked: boolean;
  saved: boolean;
  followed: boolean;
};

const currentUser = {
  author: 'Avery Lane',
  handle: '@averylane',
  avatar: 'https://i.pravatar.cc/120?img=5',
};

const initialPosts: Post[] = [
  {
    id: '1',
    author: 'Maya Chen',
    handle: '@mayacooks',
    avatar: 'https://i.pravatar.cc/120?img=32',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=85',
    mediaType: 'photo',
    category: 'LUNCH',
    title: 'Green goddess bowl',
    caption: 'The crunchy green bowl I keep making on repeat. Bright, fresh, and ready in fifteen minutes.',
    ingredients: 'Kale, avocado, cucumber, edamame, herbs, lemon tahini',
    instructions: 'Massage the kale, layer everything in a bowl, and finish with lemon tahini.',
    nutrition: '510 cal  |  24g protein',
    likes: 631,
    comments: [{ id: 'c1', author: 'Nina Park', avatar: 'https://i.pravatar.cc/120?img=44', text: 'This looks so fresh.' }],
    liked: false,
    saved: true,
    followed: true,
  },
  {
    id: '2',
    author: 'Selena Gomez',
    handle: '@selenagomez',
    avatar: 'https://i.pravatar.cc/120?img=47',
    image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200&q=85',
    mediaType: 'photo',
    category: 'BREAKFAST',
    title: 'Chili oil eggs',
    caption: 'A bright start: avocado toast, soft eggs, and a little chili oil.',
    ingredients: 'Sourdough, avocado, eggs, chili oil, flaky salt',
    instructions: 'Toast the bread, add smashed avocado, and top with soft eggs and chili oil.',
    nutrition: '420 cal  |  18g protein',
    likes: 2840,
    comments: [{ id: 'c2', author: 'Jules', avatar: 'https://i.pravatar.cc/120?img=12', text: 'Saving this for Sunday.' }],
    liked: false,
    saved: false,
    followed: true,
  },
  {
    id: '3',
    author: 'Noah Williams',
    handle: '@noahonthego',
    avatar: 'https://i.pravatar.cc/120?img=11',
    image: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=1200&q=85',
    mediaType: 'photo',
    category: 'RESTAURANT REVIEW',
    title: 'Luna Pasta Bar',
    caption: 'Tiny room, handmade pasta, and the kind of tiramisu you think about later.',
    ingredients: '',
    instructions: '',
    nutrition: '4.8 / 5  |  $$$  |  Brooklyn, NY',
    likes: 918,
    comments: [{ id: 'c3', author: 'Maya Chen', avatar: 'https://i.pravatar.cc/120?img=32', text: 'Adding this to the list.' }],
    liked: false,
    saved: false,
    followed: false,
  },
  {
    id: '4',
    author: 'Ari Flores',
    handle: '@ariflores',
    avatar: 'https://i.pravatar.cc/120?img=12',
    image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=1200&q=85',
    mediaType: 'video',
    category: 'RECIPE VIDEO',
    title: 'One-pan lemon pasta',
    caption: 'The weeknight pasta trick: one pan, lots of lemon, no complicated cleanup.',
    ingredients: 'Spaghetti, lemon, garlic, parmesan, basil',
    instructions: 'Simmer the pasta in a shallow pan with stock. Fold in lemon, cheese, and basil.',
    nutrition: '580 cal  |  21g protein',
    likes: 1204,
    comments: [{ id: 'c4', author: 'Sam Lee', avatar: 'https://i.pravatar.cc/120?img=9', text: 'The one-pan part has me convinced.' }],
    liked: false,
    saved: false,
    followed: false,
  },
];

const screenLabels: { screen: Screen; icon: keyof typeof Ionicons.glyphMap }[] = [
  { screen: 'Following', icon: 'home-outline' },
  { screen: 'Explore', icon: 'search-outline' },
  { screen: 'Create', icon: 'add' },
  { screen: 'Saved', icon: 'bookmark-outline' },
  { screen: 'Profile', icon: 'person-outline' },
];

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('Following');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [caption, setCaption] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [nutrition, setNutrition] = useState('');
  const [mediaType, setMediaType] = useState<MediaType>('photo');
  const [publishMessage, setPublishMessage] = useState('');

  function togglePost(id: string, action: 'liked' | 'saved') {
    setPosts((current) =>
      current.map((post) =>
        post.id === id
          ? { ...post, [action]: !post[action], likes: action === 'liked' ? post.likes + (post.liked ? -1 : 1) : post.likes }
          : post,
      ),
    );
  }

  function openComments(post: Post) {
    setSelectedPost(post);
    setCommentDraft('');
  }

  function addComment() {
    if (!selectedPost || !commentDraft.trim()) return;
    const comment: Comment = { id: Date.now().toString(), ...currentUser, text: commentDraft.trim() };
    setPosts((current) => current.map((post) => post.id === selectedPost.id ? { ...post, comments: [...post.comments, comment] } : post));
    setSelectedPost((current) => current ? { ...current, comments: [...current.comments, comment] } : current);
    setCommentDraft('');
  }

  function publishDraft() {
    if (!caption.trim()) {
      setPublishMessage('Add a caption before publishing your preview.');
      return;
    }
    const draft: Post = {
      id: `draft-${Date.now()}`,
      ...currentUser,
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=85',
      mediaType,
      category: mediaType === 'video' ? 'RECIPE VIDEO' : 'YOUR RECIPE',
      title: caption.trim().split(' ').slice(0, 4).join(' '),
      caption: caption.trim(),
      ingredients: ingredients.trim(),
      instructions: instructions.trim(),
      nutrition: nutrition.trim() || 'Nutrition not added',
      likes: 0,
      comments: [],
      liked: false,
      saved: false,
      followed: true,
    };
    setPosts((current) => [draft, ...current]);
    setCaption('');
    setIngredients('');
    setInstructions('');
    setNutrition('');
    setPublishMessage('Preview added to your profile and Following feed.');
  }

  const followingPosts = posts.filter((post) => post.followed || post.author === currentUser.author);
  const exploredPosts = posts.filter((post) => !post.followed && post.author !== currentUser.author);
  const savedPosts = posts.filter((post) => post.saved);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.app}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.date}>TUESDAY, OCTOBER 7</Text>
            <Text style={styles.logo}>food me</Text>
          </View>
          <Pressable accessibilityLabel="Open profile" onPress={() => setActiveScreen('Profile')} style={styles.profileButton}>
            <Image source={{ uri: currentUser.avatar }} style={styles.profileAvatar} />
          </Pressable>
        </View>

        <View style={styles.screenContent}>
          {activeScreen === 'Following' && <FeedScreen title="Following" subtitle="Your people, your plates" posts={followingPosts} onLike={togglePost} onSave={togglePost} onComments={openComments} />}
          {activeScreen === 'Explore' && <FeedScreen title="Explore" subtitle="Find your next favorite bite" posts={exploredPosts} onLike={togglePost} onSave={togglePost} onComments={openComments} />}
          {activeScreen === 'Saved' && <SavedScreen posts={savedPosts} onLike={togglePost} onSave={togglePost} onComments={openComments} onExplore={() => setActiveScreen('Explore')} />}
          {activeScreen === 'Create' && <CreateScreen caption={caption} ingredients={ingredients} instructions={instructions} nutrition={nutrition} mediaType={mediaType} message={publishMessage} onCaption={setCaption} onIngredients={setIngredients} onInstructions={setInstructions} onNutrition={setNutrition} onMediaType={setMediaType} onPublish={publishDraft} />}
          {activeScreen === 'Profile' && <ProfileScreen posts={posts.filter((post) => post.author === currentUser.author)} onCreate={() => setActiveScreen('Create')} />}
        </View>

        <View style={styles.bottomNav}>
          {screenLabels.map(({ screen, icon }) => (
            <Pressable key={screen} accessibilityRole="button" accessibilityLabel={screen} onPress={() => setActiveScreen(screen)} style={styles.navItem}>
              <View style={[styles.navIconWrap, screen === 'Create' && styles.createNavIcon, activeScreen === screen && screen !== 'Create' && styles.activeNavIcon]}>
                <Ionicons name={icon} size={screen === 'Create' ? 25 : 21} color={screen === 'Create' ? '#FFFDF8' : activeScreen === screen ? '#273D32' : '#929487'} />
              </View>
              <Text style={[styles.navLabel, activeScreen === screen && styles.activeNavLabel]}>{screen}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <CommentsModal post={selectedPost} draft={commentDraft} onDraft={setCommentDraft} onClose={() => setSelectedPost(null)} onSubmit={addComment} />
    </SafeAreaView>
  );
}

function FeedScreen({ title, subtitle, posts, onLike, onSave, onComments }: { title: string; subtitle: string; posts: Post[]; onLike: (id: string, action: 'liked' | 'saved') => void; onSave: (id: string, action: 'liked' | 'saved') => void; onComments: (post: Post) => void }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headingRow}>
        <View><Text style={styles.screenTitle}>{title}</Text><Text style={styles.screenSubtitle}>{subtitle}</Text></View>
        <Pressable accessibilityLabel="Notifications" style={styles.iconButton}><Ionicons name="notifications-outline" size={21} color="#273D32" /></Pressable>
      </View>
      <StoryStrip />
      {posts.length === 0 ? <EmptyState title="Nothing here yet" text="Follow a few food people and their posts will appear here." /> : posts.map((post) => <PostCard key={post.id} post={post} onLike={onLike} onSave={onSave} onComments={onComments} />)}
      <Text style={styles.caughtUp}>YOU ARE ALL CAUGHT UP</Text>
    </ScrollView>
  );
}

function StoryStrip() {
  const stories = [
    { name: 'Selena', image: '47' }, { name: 'Maya', image: '32' }, { name: 'Noah', image: '11' }, { name: 'Ari', image: '12' },
  ];
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storyStrip}>
    <View style={styles.storyItem}><View style={styles.addStory}><Ionicons name="add" size={23} color="#C76843" /></View><Text style={styles.storyName}>Your story</Text></View>
    {stories.map((story) => <View key={story.name} style={styles.storyItem}><Image source={{ uri: `https://i.pravatar.cc/120?img=${story.image}` }} style={styles.storyImage} /><Text style={styles.storyName}>{story.name}</Text></View>)}
  </ScrollView>;
}

function PostCard({ post, onLike, onSave, onComments }: { post: Post; onLike: (id: string, action: 'liked' | 'saved') => void; onSave: (id: string, action: 'liked' | 'saved') => void; onComments: (post: Post) => void }) {
  return <View style={styles.postCard}>
    <View style={styles.postHeader}><Image source={{ uri: post.avatar }} style={styles.postAvatar} /><View style={styles.authorInfo}><Text style={styles.author}>{post.author}</Text><Text style={styles.handle}>{post.handle}</Text></View><Pressable accessibilityLabel="Post options"><Ionicons name="ellipsis-horizontal" size={19} color="#7E8174" /></Pressable></View>
    <View style={styles.mediaWrap}><Image source={{ uri: post.image }} style={styles.postImage} />{post.mediaType === 'video' && <View style={styles.videoBadge}><Ionicons name="play" size={13} color="#FFFDF8" /><Text style={styles.videoText}>VIDEO</Text></View>}</View>
    <View style={styles.postBody}><View style={styles.postMetaRow}><Text style={styles.category}>{post.category}</Text><Text style={styles.nutrition}>{post.nutrition}</Text></View><Text style={styles.postTitle}>{post.title}</Text><Text style={styles.caption}>{post.caption}</Text>{post.ingredients ? <View style={styles.recipeBox}><Text style={styles.recipeLabel}>INGREDIENTS</Text><Text style={styles.recipeText}>{post.ingredients}</Text><Text style={styles.recipeLabel}>METHOD</Text><Text style={styles.recipeText}>{post.instructions}</Text></View> : null}<View style={styles.actionRow}><Pressable accessibilityLabel={post.liked ? 'Unlike post' : 'Like post'} onPress={() => onLike(post.id, 'liked')} style={styles.action}><Ionicons name={post.liked ? 'heart' : 'heart-outline'} size={22} color={post.liked ? '#C76843' : '#657064'} /><Text style={styles.actionCount}>{post.likes}</Text></Pressable><Pressable accessibilityLabel="View comments" onPress={() => onComments(post)} style={styles.action}><Ionicons name="chatbubble-outline" size={20} color="#657064" /><Text style={styles.actionCount}>{post.comments.length}</Text></Pressable><Pressable accessibilityLabel={post.saved ? 'Remove from saved' : 'Save post'} onPress={() => onSave(post.id, 'saved')} style={styles.saveAction}><Ionicons name={post.saved ? 'bookmark' : 'bookmark-outline'} size={21} color={post.saved ? '#A17A39' : '#657064'} /></Pressable></View></View>
  </View>;
}

function SavedScreen({ posts, onLike, onSave, onComments, onExplore }: { posts: Post[]; onLike: (id: string, action: 'liked' | 'saved') => void; onSave: (id: string, action: 'liked' | 'saved') => void; onComments: (post: Post) => void; onExplore: () => void }) {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><View style={styles.headingRow}><View><Text style={styles.screenTitle}>Saved</Text><Text style={styles.screenSubtitle}>Your little cookbook</Text></View><Ionicons name="bookmark" size={21} color="#A17A39" /></View>{posts.length === 0 ? <EmptyState title="Your saved table is empty" text="Tap the bookmark on a post to keep it close." button="Explore food" onPress={onExplore} /> : posts.map((post) => <PostCard key={post.id} post={post} onLike={onLike} onSave={onSave} onComments={onComments} />)}</ScrollView>;
}

function CreateScreen({ caption, ingredients, instructions, nutrition, mediaType, message, onCaption, onIngredients, onInstructions, onNutrition, onMediaType, onPublish }: { caption: string; ingredients: string; instructions: string; nutrition: string; mediaType: MediaType; message: string; onCaption: (value: string) => void; onIngredients: (value: string) => void; onInstructions: (value: string) => void; onNutrition: (value: string) => void; onMediaType: (value: MediaType) => void; onPublish: () => void }) {
  return <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.createRoot}><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.createContent}><View style={styles.headingRow}><View><Text style={styles.screenTitle}>Create post</Text><Text style={styles.screenSubtitle}>Share what is on your plate</Text></View><Ionicons name="sparkles-outline" size={21} color="#C76843" /></View><View style={styles.mediaPicker}><Pressable onPress={() => onMediaType('photo')} style={[styles.mediaOption, mediaType === 'photo' && styles.activeMediaOption]}><Ionicons name="image-outline" size={18} color={mediaType === 'photo' ? '#FFFDF8' : '#273D32'} /><Text style={[styles.mediaOptionText, mediaType === 'photo' && styles.activeMediaText]}>Photo</Text></Pressable><Pressable onPress={() => onMediaType('video')} style={[styles.mediaOption, mediaType === 'video' && styles.activeMediaOption]}><Ionicons name="videocam-outline" size={18} color={mediaType === 'video' ? '#FFFDF8' : '#273D32'} /><Text style={[styles.mediaOptionText, mediaType === 'video' && styles.activeMediaText]}>Video</Text></Pressable></View><View style={styles.draftPreview}><Image source={{ uri: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=1200&q=85' }} style={styles.previewImage} />{mediaType === 'video' && <View style={styles.previewOverlay}><Ionicons name="play-circle" size={42} color="#FFFDF8" /><Text style={styles.previewOverlayText}>VIDEO PREVIEW</Text></View>}</View><Text style={styles.fieldLabel}>CAPTION</Text><TextInput value={caption} onChangeText={onCaption} placeholder="What did you make?" placeholderTextColor="#A5A69B" multiline style={[styles.input, styles.captionInput]} /><Text style={styles.fieldLabel}>INGREDIENTS</Text><TextInput value={ingredients} onChangeText={onIngredients} placeholder="List the ingredients" placeholderTextColor="#A5A69B" multiline style={styles.input} /><Text style={styles.fieldLabel}>INSTRUCTIONS</Text><TextInput value={instructions} onChangeText={onInstructions} placeholder="How did you make it?" placeholderTextColor="#A5A69B" multiline style={[styles.input, styles.instructionsInput]} /><Text style={styles.fieldLabel}>MANUAL NUTRITION <Text style={styles.optional}>(OPTIONAL)</Text></Text><TextInput value={nutrition} onChangeText={onNutrition} placeholder="Example: 520 cal  |  25g protein" placeholderTextColor="#A5A69B" style={styles.input} /><Text style={styles.helper}>Nutrition is user-entered and approximate.</Text>{message ? <Text style={styles.publishMessage}>{message}</Text> : null}<Pressable onPress={onPublish} style={styles.publishButton}><Text style={styles.publishText}>Add to prototype feed</Text><Ionicons name="arrow-forward" size={18} color="#FFFDF8" /></Pressable></ScrollView></KeyboardAvoidingView>;
}

function ProfileScreen({ posts, onCreate }: { posts: Post[]; onCreate: () => void }) {
  return <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.profileContent}><View style={styles.profileHero}><Image source={{ uri: currentUser.avatar }} style={styles.largeAvatar} /><Text style={styles.profileName}>{currentUser.author}</Text><Text style={styles.profileHandle}>{currentUser.handle}</Text><Text style={styles.profileBio}>Home cooking, restaurant notes, and the meals in between.</Text><View style={styles.stats}><View><Text style={styles.statNumber}>{posts.length}</Text><Text style={styles.statLabel}>POSTS</Text></View><View><Text style={styles.statNumber}>248</Text><Text style={styles.statLabel}>FOLLOWERS</Text></View><View><Text style={styles.statNumber}>184</Text><Text style={styles.statLabel}>FOLLOWING</Text></View></View><Pressable onPress={onCreate} style={styles.profileButtonWide}><Ionicons name="add" size={18} color="#FFFDF8" /><Text style={styles.profileButtonText}>Create a post</Text></Pressable></View><Text style={styles.sectionTitle}>Your posts</Text>{posts.length === 0 ? <EmptyState title="Your first post is waiting" text="Share a meal, a recipe, or a restaurant you loved." button="Create post" onPress={onCreate} /> : <View style={styles.grid}>{posts.map((post) => <View key={post.id} style={styles.gridItem}><Image source={{ uri: post.image }} style={styles.gridImage} />{post.mediaType === 'video' && <Ionicons name="play-circle" size={24} color="#FFFDF8" style={styles.gridPlay} />}</View>)}</View>}</ScrollView>;
}

function EmptyState({ title, text, button, onPress }: { title: string; text: string; button?: string; onPress?: () => void }) {
  return <View style={styles.emptyState}><Ionicons name="restaurant-outline" size={30} color="#C76843" /><Text style={styles.emptyTitle}>{title}</Text><Text style={styles.emptyText}>{text}</Text>{button && onPress ? <Pressable onPress={onPress} style={styles.emptyButton}><Text style={styles.emptyButtonText}>{button}</Text></Pressable> : null}</View>;
}

function CommentsModal({ post, draft, onDraft, onClose, onSubmit }: { post: Post | null; draft: string; onDraft: (value: string) => void; onClose: () => void; onSubmit: () => void }) {
  return <Modal animationType="slide" transparent visible={Boolean(post)} onRequestClose={onClose}><View style={styles.modalBackdrop}><Pressable style={styles.modalDismiss} onPress={onClose} /><View style={styles.commentSheet}><View style={styles.sheetHandle} /><View style={styles.sheetHeader}><Text style={styles.sheetTitle}>Comments</Text><Pressable accessibilityLabel="Close comments" onPress={onClose}><Ionicons name="close" size={22} color="#273D32" /></Pressable></View><ScrollView style={styles.commentsList}>{post?.comments.map((comment) => <View key={comment.id} style={styles.comment}><Image source={{ uri: comment.avatar }} style={styles.commentAvatar} /><View style={styles.commentCopy}><Text style={styles.commentAuthor}>{comment.author}</Text><Text style={styles.commentText}>{comment.text}</Text></View></View>)}</ScrollView><View style={styles.commentComposer}><TextInput value={draft} onChangeText={onDraft} placeholder="Add a thoughtful bite..." placeholderTextColor="#A5A69B" style={styles.commentInput} /><Pressable accessibilityLabel="Post comment" onPress={onSubmit} style={styles.commentSend}><Ionicons name="arrow-up" size={18} color="#FFFDF8" /></Pressable></View></View></View></Modal>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F3EC' },
  app: { flex: 1, backgroundColor: '#F7F3EC' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 10, paddingBottom: 12 },
  date: { color: '#8B8C78', fontSize: 9, fontWeight: '800', letterSpacing: 1.5 },
  logo: { color: '#273D32', fontSize: 28, fontWeight: '800', letterSpacing: -1 },
  profileButton: { borderWidth: 1, borderColor: '#C7C9B9', borderRadius: 22, padding: 2 },
  profileAvatar: { width: 37, height: 37, borderRadius: 19 },
  screenContent: { flex: 1 },
  scrollContent: { paddingBottom: 30 },
  headingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 22, paddingTop: 8, paddingBottom: 14 },
  screenTitle: { color: '#273D32', fontSize: 25, fontWeight: '800', letterSpacing: -0.5 },
  screenSubtitle: { color: '#8B8C78', fontSize: 12, marginTop: 3 },
  iconButton: { width: 40, height: 40, borderWidth: 1, borderColor: '#E2DED4', borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  storyStrip: { gap: 15, paddingHorizontal: 22, paddingBottom: 18 },
  storyItem: { alignItems: 'center', width: 58 },
  addStory: { width: 53, height: 53, borderRadius: 27, borderWidth: 1, borderColor: '#C76843', alignItems: 'center', justifyContent: 'center' },
  storyImage: { width: 53, height: 53, borderRadius: 27, borderWidth: 2, borderColor: '#C76843' },
  storyName: { color: '#6E7065', fontSize: 10, marginTop: 5 },
  postCard: { backgroundColor: '#FFFDF8', marginBottom: 17 },
  postHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 12 },
  postAvatar: { width: 36, height: 36, borderRadius: 18 },
  authorInfo: { flex: 1, marginLeft: 10 },
  author: { color: '#273D32', fontSize: 13, fontWeight: '800' },
  handle: { color: '#9B9A8D', fontSize: 11, marginTop: 2 },
  mediaWrap: { position: 'relative' },
  postImage: { width: '100%', height: 300, backgroundColor: '#E6E0D5' },
  videoBadge: { position: 'absolute', top: 13, right: 15, flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 13, backgroundColor: 'rgba(39,61,50,0.88)' },
  videoText: { color: '#FFFDF8', fontSize: 9, fontWeight: '800', letterSpacing: 0.8 },
  postBody: { paddingHorizontal: 22, paddingTop: 14, paddingBottom: 17 },
  postMetaRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  category: { color: '#C76843', fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  nutrition: { color: '#8B8C78', fontSize: 11, flexShrink: 1 },
  postTitle: { color: '#273D32', fontSize: 19, fontWeight: '800', marginTop: 7 },
  caption: { color: '#4F5D51', fontSize: 14, lineHeight: 20, marginTop: 5 },
  recipeBox: { backgroundColor: '#F5F0E7', borderRadius: 8, padding: 12, marginTop: 12 },
  recipeLabel: { color: '#A17A39', fontSize: 9, fontWeight: '900', letterSpacing: 1, marginTop: 3 },
  recipeText: { color: '#596357', fontSize: 12, lineHeight: 17, marginTop: 3, marginBottom: 7 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 19, marginTop: 15 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  actionCount: { color: '#697065', fontSize: 12 },
  saveAction: { marginLeft: 'auto' },
  caughtUp: { textAlign: 'center', color: '#9B9A8D', fontSize: 9, fontWeight: '800', letterSpacing: 1.2, paddingVertical: 6 },
  bottomNav: { height: 73, borderTopWidth: 1, borderTopColor: '#E2DED4', backgroundColor: '#F7F3EC', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 7 },
  navItem: { alignItems: 'center', justifyContent: 'center', minWidth: 57, gap: 3 },
  navIconWrap: { width: 34, height: 27, alignItems: 'center', justifyContent: 'center', borderRadius: 15 },
  activeNavIcon: { backgroundColor: '#E3E8D9' },
  createNavIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#C76843', marginTop: -15, borderWidth: 4, borderColor: '#F7F3EC' },
  navLabel: { color: '#929487', fontSize: 9, fontWeight: '600' },
  activeNavLabel: { color: '#273D32', fontWeight: '800' },
  createRoot: { flex: 1 },
  createContent: { paddingHorizontal: 22, paddingBottom: 35 },
  mediaPicker: { flexDirection: 'row', backgroundColor: '#EDE9DF', borderRadius: 8, padding: 4, marginBottom: 15 },
  mediaOption: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 6, paddingVertical: 10 },
  activeMediaOption: { backgroundColor: '#273D32' },
  mediaOptionText: { color: '#273D32', fontSize: 13, fontWeight: '700' },
  activeMediaText: { color: '#FFFDF8' },
  draftPreview: { height: 175, borderRadius: 10, overflow: 'hidden', position: 'relative', marginBottom: 19 },
  previewImage: { width: '100%', height: '100%' },
  previewOverlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(39,61,50,0.33)' },
  previewOverlayText: { color: '#FFFDF8', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginTop: 6 },
  fieldLabel: { color: '#A17A39', fontSize: 9, fontWeight: '900', letterSpacing: 1.1, marginBottom: 7, marginTop: 5 },
  optional: { color: '#9B9A8D', fontWeight: '600' },
  input: { backgroundColor: '#FFFDF8', borderWidth: 1, borderColor: '#E2DED4', borderRadius: 8, paddingHorizontal: 13, paddingVertical: 11, color: '#273D32', fontSize: 14, marginBottom: 13, minHeight: 44 },
  captionInput: { minHeight: 73, textAlignVertical: 'top' },
  instructionsInput: { minHeight: 82, textAlignVertical: 'top' },
  helper: { color: '#9B9A8D', fontSize: 11, marginTop: -5, marginBottom: 13 },
  publishMessage: { color: '#C76843', fontSize: 12, lineHeight: 17, marginBottom: 10 },
  publishButton: { backgroundColor: '#C76843', borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 9, paddingVertical: 14 },
  publishText: { color: '#FFFDF8', fontSize: 14, fontWeight: '800' },
  profileContent: { paddingBottom: 35 },
  profileHero: { alignItems: 'center', paddingHorizontal: 22, paddingBottom: 22 },
  largeAvatar: { width: 83, height: 83, borderRadius: 42, borderWidth: 3, borderColor: '#C76843', marginTop: 5 },
  profileName: { color: '#273D32', fontSize: 22, fontWeight: '800', marginTop: 10 },
  profileHandle: { color: '#9B9A8D', fontSize: 12, marginTop: 2 },
  profileBio: { color: '#596357', fontSize: 13, lineHeight: 19, textAlign: 'center', maxWidth: 285, marginTop: 10 },
  stats: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E2DED4', paddingBottom: 16 },
  statNumber: { color: '#273D32', fontSize: 18, fontWeight: '800', textAlign: 'center' },
  statLabel: { color: '#9B9A8D', fontSize: 9, fontWeight: '800', letterSpacing: 0.8, marginTop: 4 },
  profileButtonWide: { backgroundColor: '#273D32', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 7, paddingVertical: 11, paddingHorizontal: 30, marginTop: 17 },
  profileButtonText: { color: '#FFFDF8', fontSize: 13, fontWeight: '800' },
  sectionTitle: { color: '#273D32', fontSize: 17, fontWeight: '800', paddingHorizontal: 22, marginBottom: 11 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  gridItem: { width: '32.9%', aspectRatio: 1, position: 'relative' },
  gridImage: { width: '100%', height: '100%' },
  gridPlay: { position: 'absolute', top: 8, right: 8 },
  emptyState: { alignItems: 'center', paddingHorizontal: 35, paddingVertical: 55 },
  emptyTitle: { color: '#273D32', fontSize: 18, fontWeight: '800', marginTop: 12, textAlign: 'center' },
  emptyText: { color: '#8B8C78', fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 6 },
  emptyButton: { backgroundColor: '#273D32', borderRadius: 7, paddingHorizontal: 17, paddingVertical: 11, marginTop: 17 },
  emptyButtonText: { color: '#FFFDF8', fontSize: 12, fontWeight: '800' },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(24,34,28,0.35)' },
  modalDismiss: { flex: 1 },
  commentSheet: { maxHeight: '72%', backgroundColor: '#FFFDF8', borderTopLeftRadius: 18, borderTopRightRadius: 18, paddingHorizontal: 22, paddingTop: 10, paddingBottom: Platform.OS === 'ios' ? 25 : 14 },
  sheetHandle: { width: 38, height: 4, borderRadius: 2, backgroundColor: '#D4D1C6', alignSelf: 'center', marginBottom: 12 },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderColor: '#E2DED4' },
  sheetTitle: { color: '#273D32', fontSize: 18, fontWeight: '800' },
  commentsList: { paddingVertical: 8 },
  comment: { flexDirection: 'row', gap: 9, paddingVertical: 10 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16 },
  commentCopy: { flex: 1 },
  commentAuthor: { color: '#273D32', fontSize: 12, fontWeight: '800' },
  commentText: { color: '#596357', fontSize: 13, lineHeight: 18, marginTop: 2 },
  commentComposer: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderColor: '#E2DED4', paddingTop: 10 },
  commentInput: { flex: 1, height: 42, borderWidth: 1, borderColor: '#E2DED4', borderRadius: 21, paddingHorizontal: 15, color: '#273D32', fontSize: 13 },
  commentSend: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#C76843', alignItems: 'center', justifyContent: 'center' },
});
