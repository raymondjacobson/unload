//
//  ViewController.h
//  Unload
//
//  Created by Matthew Kohrs on 6/28/14.
//  Copyright (c) 2014 Matthew Kohrs. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController
@property (strong, nonatomic) IBOutlet UIImageView *image;
- (IBAction)backgroundTap:(id)sender;
@property (strong, nonatomic) IBOutlet UITextField *textField;

@end
