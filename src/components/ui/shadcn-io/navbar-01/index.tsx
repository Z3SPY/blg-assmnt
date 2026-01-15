import * as React from 'react';
import { Button } from '@/components/ui/button';
import { useEffect, useState, useRef } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';


// Icons
import { PencilLine, Signature, CircleUser  } from 'lucide-react';
import HamburgerIcon from '@/components/ui/hamburger';
import type { AppDispatch, RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/AuthServices';
import { _rdxLogout } from '@/state/session/session';


// Hamburger icon component


// Types
export interface Navbar01NavLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface Navbar01Props extends React.HTMLAttributes<HTMLElement> {
  logo?: React.ReactNode;
  logoHref?: string;
  navigationLinks?: Navbar01NavLink[];
  signInText?: string;
  signInHref?: string;
  ctaText?: string;
  ctaHref?: string;
  createBlog?: string;
  createBlogHref?: string;


  onSignInClick?: () => void;
  onCtaClick?: () => void;
  onCreateClick?: () => void;

  onLogoClick?: () => void;


  // Session Checker
  userIdSession?: string | null;

  wherePage?: string;

}


// Have to do use STATE for changes in ACTIVE do it later
// Default navigation links
const defaultNavigationLinks: Navbar01NavLink[] = [
  { href: '#home', label: 'Home', active: true, },
  { href: '#blogs', label: 'Blogs' },
  { href: '#about', label: 'About' },
];

export const Navbar01 = React.forwardRef<HTMLElement, Navbar01Props>(
  (
    {
      className,
      logo = <PencilLine />,
      logoHref = '#',
      navigationLinks = defaultNavigationLinks,
      signInText = 'Sign In',
      signInHref = '#signin',
      ctaText = 'Get Started',
      ctaHref = '#get-started',
      createBlog = 'Start Blogging',
      createBlogHref ='#create-blog',

      onCreateClick,
      onSignInClick,
      onCtaClick,
      userIdSession,
      onLogoClick,

      wherePage = 'Home',
      ...props
    },
    ref
  ) => {
    const navigate = useNavigate();

    // redux Session Chekcer
    const {userName, userId} = useSelector((state: RootState) => state.session)

    const dispatch = useDispatch<AppDispatch>();

    function handleLogout() {
            authService.signOut(); // Kills the session from service
            dispatch(_rdxLogout()); // Complete Reset Redux
            navigate("/");
    }

    // Ends here


    const [isMobile, setIsMobile] = useState(false);
    const containerRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const checkWidth = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          setIsMobile(width < 768); // 768px is md breakpoint
        }
      };

      checkWidth();

      const resizeObserver = new ResizeObserver(checkWidth);
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }, []);


    const [isMounted, setIsMounted] = useState(false); // Mount Check
    const [isLoading, setIsLoading] = useState(true);
    // Separate Use Effect for Mount Check
    useEffect(() => {
      setIsMounted(true);
    }, []);

    useEffect(() => {
      if (userIdSession !== undefined) { 
        setIsLoading(false);
      }
    }, [userIdSession]);

    // Combine refs
    const combinedRef = React.useCallback((node: HTMLElement | null) => {
      containerRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ref]);

    
    // THIS IS IMPORTANT NAVIGATES TO PROFILE WITH ID
    const NavigateToProfile = (id: string) => {
      navigate(`/profile/${id}`);
    }

    return (
      <header
        ref={combinedRef}
        className={cn(
          'font-sans sticky top-0 z-50 w-full border-b bg-background/100 backdrop-blur supports-[backdrop-filter]:bg-background/100 px-4 md:px-6 [&_*]:no-underline',
          className
        )}
      >
        <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4">
          
          
          {/* Left side */}
          <div className="flex items-center gap-2">



            {/* Mobile menu trigger */}
            {isMobile && wherePage === "Home" && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className="group h-9 w-9 hover:bg-accent hover:text-accent-foreground"
                    variant="ghost"
                    size="icon"
                  >
                    <HamburgerIcon />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-48 p-2">
                <NavigationMenu className="max-w-none">
                  <NavigationMenuList className="flex-col items-start gap-1">
                    {navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index} className="w-full">
                        <NavigationMenuLink > {/* Wrap in Link with asChild */}
                          <button 
                            onClick={(e) => {e.preventDefault();
                              document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className={cn(
                              "flex w-full items-center rounded-md px-3 py-2 text-sm font-medium...",
                              link.active ? "bg-accent text-accent-foreground" : "text-foreground/80"
                            )}
                          >
                            {link.label}
                          </button>
                        </NavigationMenuLink>
                      </NavigationMenuItem>
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>
                </PopoverContent>
              </Popover>
            )}



            {/* Main nav */}
            <div className="flex items-center gap-6">
              <button 
                onClick={(e) => e.preventDefault()}
                className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors cursor-pointer"
              >
                <div className="text-2xl" onClick={()=>navigate("/")}>
                  {logo}
                </div>
                <span className="hidden font-bold text-xl sm:inline-block" onClick={()=>navigate("/")} >Jotted.</span>
              </button>
              {/* Navigation menu */}
              {!isMobile && (
                <NavigationMenu className="flex">
                <NavigationMenuList className="gap-1">



                  { wherePage === "Home" ?
                  
                    navigationLinks.map((link, index) => (
                      <NavigationMenuItem key={index}>
                        <button
                          onClick={(e) => {e.preventDefault();
                              document.querySelector(link.href)?.scrollIntoView({ behavior: "smooth" });
                            }}
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer no-underline",
                            link.active 
                              ? "bg-accent text-accent-foreground" 
                              : "text-foreground/80 hover:text-foreground"
                          )}
                        >
                          {link.label}
                        </button>
                      </NavigationMenuItem>
                    )) : 
                    
                    null
                  }
                </NavigationMenuList>
                </NavigationMenu>
              )}
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-3">
              {/** CHECK THE SESSION other wise dont Show */}
              {!isLoading && isMounted ? 
                
                userIdSession ? (
                  <div className='flex items-center gap-3 animate-in fade-in duration-500 '>
                    { wherePage === "Home" ? 
                      <Button
                        className='duration-100 hover:-translate-y-[-2px] transition-transform ease-in-out'
                        onClick={(e) => {
                          e.preventDefault();
                          onCreateClick?.();
                        }}
                      >
                        <Signature />
                        {createBlog}
                      </Button>
                      : null
                    }
                    
                      
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                        className='duration-100 hover:-translate-y-[-2px] transition-transform ease-in-out'
                        variant={"outline"}>
                          <CircleUser /> 
                          Profile
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="flex flex-col ">
                          <h1 className='text-center border-b-2 mb-2 p-2'> Logged in as: {userName} </h1>

                          { wherePage != "Profile" ? 
                          <Button variant={"outline"} className='mb-2'
                            onClick={()=>{NavigateToProfile(userId!)}}
                          > Go To Profile </Button>: null}
                          

                          <Button onClick={(e)=>{
                            e.preventDefault();
                            handleLogout();
                          }}> Sign Out </Button>
                      </PopoverContent>
                    </Popover> 
                    

                

                  </div>  
                ) : (
                  <div className="flex items-center gap-3 animate-in fade-in duration-500">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-sm font-medium hover:bg-accent hover:text-accent-foreground 
                                duration-100 hover:-translate-y-[-2px] transition-transform ease-in-out"
                      onClick={(e) => {
                        e.preventDefault();
                        onSignInClick?.();
                      }}
                    >
                      {signInText}
                    </Button>
                    
                    <Button
                      size="sm"
                      className="text-sm font-medium px-4 h-9 rounded-md shadow-sm
                                duration-100 hover:-translate-y-[-2px] transition-transform ease-in-out"
                      onClick={(e) => {
                        e.preventDefault();
                        onCtaClick?.();
                      }}
                    >
                      {ctaText}
                    </Button>
                </div>
                )

              : <div className="h-9 w-20 bg-muted/20 animate-pulse rounded-md" />}
          </div>
        </div>
      </header>
    );
  }
);

Navbar01.displayName = 'Navbar01';

export { HamburgerIcon };