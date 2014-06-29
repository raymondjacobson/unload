//
//  ViewController.m
//  Unload
//
//  Created by Matthew Kohrs on 6/28/14.
//  Copyright (c) 2014 Matthew Kohrs. All rights reserved.
//

#import "ViewController.h"
#import "ViewController2.h"

@interface ViewController ()
@property (nonatomic, strong) NSMutableData *responseData;
@end

@implementation ViewController

@synthesize responseData = _responseData;

- (void)viewDidLoad {
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    ViewController2 *controller = (ViewController2 *)segue.destinationViewController;
    controller.textContent = self.textField.text;
    NSLog(@"%@" , _textField);
    
}

- (IBAction)backgroundTap:(id)sender{
    [self.view endEditing:YES];
}








@end
