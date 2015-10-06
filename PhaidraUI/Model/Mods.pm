package PhaidraUI::Model::Mods;

use strict;
use warnings;
use diagnostics;
use v5.10;
use Storable qw(dclone);
use base qw/Mojo::Base/;

sub mods_fill_tree {

	my $self = shift;
	my $c = shift;
	# what was saved in db
	my $mods = shift;
	# what we are filling with the saved values; this is what we return to frontend
	my $tree = shift;

	my %mods_nodes_hash;
	my $tree_copy = dclone($tree);

	$self->create_mods_nodes_hash($c, $tree_copy, \%mods_nodes_hash, '');
       
	# remove the relatedItem node from the empty tree
	$self->remove_relatedItem_node($c, $tree);

	$self->mods_fill_tree_rec($c, $mods, $tree, \%mods_nodes_hash, '');
        #$c->app->log->info("mods567890:".$c->app->dumper($tree));
	$self->unset_used_node_flag($c, $tree);

}

sub remove_relatedItem_node {
	my $self = shift;
	my $c = shift;
	my $tree = shift;

	my $i = 0;
	for (my $i = @{$tree}; $i--;){
		splice @{$tree}, $i, 1 if @{$tree}[$i]->{xmlname} eq 'relatedItem';
	}
}

sub mods_fill_tree_rec {
	my $self = shift;
	my $c = shift;
	my $read_children = shift; # this is input from mongoDb
	#$c->app->log->info("mods_abc:".$c->app->dumper($read_children));
	my $ mods_tree = shift; #this is result
	my $mods_nodes_hash = shift; 
	my $path = shift;

	my $i = 0;
	foreach my $n (@{$read_children}){

		my $child_path = ($path eq '' ? '' : $path.'_').$n->{xmlname};

		$i++;

		if($n->{xmlname} eq 'relatedItem'){

			my $relitem_node = dclone($mods_nodes_hash->{'relatedItem'});
			# copy attributes
			foreach my $n_a (@{$n->{attributes}}){
				if(defined($n_a->{ui_value}) && $n_a->{ui_value} ne ''){
					foreach my $c_a (@{$relitem_node->{attributes}}){
						if($n_a->{xmlname} eq $c_a->{xmlname}){
							$c_a->{ui_value} = $n_a->{ui_value};
						}
					}
				}
			}
			# copy children
			$relitem_node->{children} = $n->{children};
			# add stuff as attributes, labels etc to the children
			foreach my $ch (@{$relitem_node->{children}}){
				$self->add_properties_rec($c, '', $ch, $mods_nodes_hash);
			}

			splice @{$mods_tree}, $i, 0, $relitem_node;

		}else{
			# this gives as an empty node to fill (it adds new one if needed)
			# it also keeps recursion in $mods/$children, which we read, in sync with $mods_tree, which we are writing to
			my $current_mods_tree_node = $self->mods_get_emtpy_tree_node($c, $child_path, $mods_tree, '', $mods_nodes_hash);

			unless($current_mods_tree_node->{xmlname}){
				$c->app->log->error("ERROR, no node found for path $child_path (".$current_mods_tree_node->{xmlname}."):".$current_mods_tree_node->{input_type}."\n".$c->app->dumper($n));
			}

			if(defined($n->{ui_value}) && $n->{ui_value} ne ''){
				   #$c->app->log->info("mods_abc:".$c->app->dumper($n->{ui_value}));
				   $current_mods_tree_node->{ui_value} = $n->{ui_value};
			}

			# copy attribute values
			foreach my $n_a (@{$n->{attributes}}){
				if(defined($n_a->{ui_value}) && $n_a->{ui_value} ne ''){
					foreach my $c_a (@{$current_mods_tree_node->{attributes}}){
						if($n_a->{xmlname} eq $c_a->{xmlname}){
                                                        $c->app->log->info("mods_def1:".$c->app->dumper($n_a->{ui_value}));
							$c_a->{ui_value} = $n_a->{ui_value};
						}
					}
				}
			}

			my $children_size = defined($n->{children}) ? scalar (@{$n->{children}}) : 0;
			if($children_size > 0){
				$self->mods_fill_tree_rec($c, $n->{children}, $mods_tree, $mods_nodes_hash, $child_path);
			}

			if($current_mods_tree_node->{input_type} eq 'node'){
				$current_mods_tree_node->{used_node} = 1;
			}
			#$c->app->log->info("mods_ghk:".$c->app->dumper($current_mods_tree_node));
		}

	}

}

sub add_properties_rec {
	my $self = shift;
	my $c = shift;
	my $path = shift;
	my $node = shift;
	my $mods_nodes_hash = shift;

	my $child_path = ($path eq '' ? '' : $path.'_').$node->{xmlname};

	my $ref_node = dclone($mods_nodes_hash->{$child_path});

	foreach my $k (keys $ref_node){
			if($k ne 'attributes' && $k ne 'children' && $k ne 'ui_value'){
				$node->{$k} = $ref_node->{$k};
			}
	}

	# copy attributes	from ref_node to node
	foreach my $r_a (@{$ref_node->{attributes}}){

		my $found = 0;
		foreach my $n_a (@{$node->{attributes}}){
			if($n_a->{xmlname} eq $r_a->{xmlname}){
				foreach my $k (keys $r_a){
						if($k ne 'attributes' && $k ne 'children' && $k ne 'ui_value'){
							$n_a->{$k} = $r_a->{$k};
						}
				}
				$found = 1;
			}
		}

		unless($found){
			push @{$node->{attributes}}, $r_a;
		}

	}

	foreach my $n (@{$node->{children}}){
		$self->add_properties_rec($c, $child_path, $n, $mods_nodes_hash);
	}

}

sub create_mods_nodes_hash {

	my $self = shift;
	my $c = shift;
	my $children = shift;
	my $h = shift;
	my $parent_path = shift;

	foreach my $n (@{$children}){

		my $path = ($parent_path eq '' ? '' : $parent_path.'_').$n->{xmlname};

		$h->{$path} = $n;

		my $children_size = defined($n->{children}) ? scalar (@{$n->{children}}) : 0;
		if($children_size > 0){
			$self->create_mods_nodes_hash($c, $n->{children}, $h, $path);
		}

	}

}

sub unset_used_node_flag {

	my $self = shift;
	my $c = shift;
	my $children = shift;

	foreach my $n (@{$children}){

		delete $n->{used_node} if exists $n->{used_node};

		my $children_size = defined($n->{children}) ? scalar (@{$n->{children}}) : 0;
		if($children_size > 0){
			$self->unset_used_node_flag($c, $n->{children});
		}
	}
}

sub mods_get_emtpy_tree_node {
	my ($self, $c, $search_path, $mods_tree, $mods_tree_path, $mods_nodes_hash) = @_;

	my $node;
	my $i = 0;

	foreach my $n (@{$mods_tree}){
		my $children_size = defined($n->{children}) ? scalar (@{$n->{children}}) : 0;
		my $curr_path = ($mods_tree_path eq '' ? '' : $mods_tree_path.'_').$n->{xmlname};
		if($curr_path eq $search_path){
			# we have found the node we are searching for, is it empty?
			if( (defined($n->{ui_value}) && $n->{ui_value} ne '') || $n->{used_node}){
				# it's not, add new node
				my $new_node = dclone($mods_nodes_hash->{$search_path});
				splice @{$mods_tree}, $i, 0, $new_node;

				$node = $new_node;
			}else{
				$node = $n;
			}

		}elsif($children_size > 0){
			$node = $self->mods_get_emtpy_tree_node($c, $search_path, $n->{children}, $curr_path, $mods_nodes_hash);
		}

		$i++;

		last if defined $node;
	}
	return $node;
}

sub mods_strip_empty_nodes {
	my $self = shift;
	my $c = shift;
	my $children = shift;

	for my $i ( 0 .. $#$children ) {

		my $node = @{$children}[$i];

		# remove children if there are no values in the subtree
		my $children_size = defined($node->{children}) ? scalar (@{$node->{children}}) : 0;
		if($children_size > 0){
			$self->mods_strip_empty_nodes($c, $node->{children});
			my $children_size2 = defined($node->{children}) ? scalar (@{$node->{children}}) : 0;
			if($children_size2 == 0){
				delete $node->{children};
			}
		}else{
			if(exists($node->{children})){
				delete $node->{children};
			}
		}

		# remove empty attributes
		my $a = $node->{attributes};
		for my $j ( 0 .. $#$a ) {
			if(!defined(@{$a}[$j]->{ui_value}) || @{$a}[$j]->{ui_value} eq ''){
				undef @{$a}[$j];
			}
		}
		@{$a} = grep{ defined }@{$a};
		if(scalar @{$a} > 0){
			$node->{attributes} = $a;
		}else{
			delete $node->{attributes};
		}

		if(!exists($node->{children}) && !exists($node->{attributes}) && (!defined($node->{ui_value}) || $node->{ui_value} eq '' )){
			# delete the node itself
			undef @{$children}[$i];
		}

	}

	# remove undefined nodes
	@{$children} = grep{ defined }@{$children};

	return $children;
}


1;
__END__
